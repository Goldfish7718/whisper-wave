import { users } from "../index.js";
import Chat from "../models/chatModel.js";

// A FUNCTION TO STORE EVERY MESSAGE IN THE CONVERSATION AND EMIT EVENTS THROUGH WEBSOCKETS
// Accessed through Web Sockets.
export const processPrivateMessage = async (socket, data) => {
  try {
    // EXTRACT REQUIRED DATA
    const { sender, recipient, message } = data;

    const recipientSocketId = users[recipient];
    const senderSocketId = users[sender];

    if (senderSocketId) {
      // FIND IF CHAT EXISTS IN DB
      let existingChat = await Chat.findOne({
        $or: [
          { participant1: sender, participant2: recipient },
          { participant1: recipient, participant2: sender },
        ],
      });

      if (existingChat) {
        if (existingChat.chats.length == 0) {
          const newChatBlock = {
            sender,
            messages: [
              {
                messageText: message,
              },
            ],
          };

          existingChat.chats.push(newChatBlock);
        } else {
          // CASE WHEN CHATEXISTS AND CHECKING IF SENDER IS THE SAME AS LAST MESSAGE
          const existingChatBlock =
            existingChat.chats[existingChat.chats.length - 1];

          // CASE WHEN SENDER IS THE SAME, ONLY PUSH TO EXISTING CHAT BLOCK
          if (existingChatBlock.sender === sender) {
            existingChatBlock.messages.push({
              messageText: message,
            });
          } else {
            // CASE WHEN SENDER IS DIFFERENT, CREATE NEW CHATBLOCK
            existingChat.chats.push({
              sender,
              messages: [
                {
                  messageText: message,
                },
              ],
            });
          }
        }

        await existingChat.save();
      } else {
        // CASE WHEN CHAT DOES NOT EXIST BETWEEN TWO PARTICIPANTS, CREATE NEW DOCUMENT IN DATABASE
        await Chat.create({
          participant1: sender,
          participant2: recipient,
          chats: [
            {
              sender,
              messages: [
                {
                  messageText: message,
                },
              ],
            },
          ],
        });
      }

      let newMessageObj = {
        messageText: message,
        time: Date.now(),
      };

      // EMIT EVENT TO CLIENT
      if (recipientSocketId) {
        socket
          .to(recipientSocketId)
          .emit("privateMessage", { sender, newMessageObj });
      }

      socket.emit("privateMessage", { sender, newMessageObj });
      console.log(`Message from ${sender} to ${recipient}: ${message}`);
    } else {
      console.log(`User ${recipient} not found`);
    }
  } catch (error) {
    console.log(error);
  }
};

// API ENDPOINT FUNCTION TO FETCH CHATS BETWEEN TWO USERS
export const getChats = async (req, res) => {
  try {
    const { userId, contactId } = req.params;

    let chats;

    chats = await Chat.findOne({
      $or: [
        { participant1: userId, participant2: contactId },
        { participant1: contactId, participant2: userId },
      ],
    });

    if (!chats) {
      chats = {
        participant1: userId,
        participant2: contactId,
        chats: [],
      };

      return res.status(200).json({ chats });
    }

    res.status(200).json({ chats });
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "Internal Server Error" });
  }
};
