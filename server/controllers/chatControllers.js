import { users } from "../index.js";
import Chat from "../models/chatModel.js"

export const processPrivateMessage = async (socket, data) => {
    try {
        // EXTRACT REQUIRED DATA
        const { sender, recipient, message } = data;
        const recipientSocketId = users[recipient];

        if (recipientSocketId) {

            // FIND IF CHAT EXISTS IN DB
            let existingChat = await Chat.findOne({
                $or: [
                    { participant1: sender, participant2: recipient },
                    { participant1: recipient, participant2: sender }
                ]
            });


            if (existingChat) {
                // CASE WHEN CHATEXISTS AND CHECKING IF SENDER IS THE SAME AS LAST MESSAGE
                const existingChatBlock = existingChat.chats[existingChat.chats.length - 1]
                
                // CASE WHEN SENDER IS THE SAME, ONLY PUSH TO EXISTING CHAT BLOCK
                if (existingChatBlock.sender === sender) {
                    existingChatBlock.messages.push(message)
                } else {
                    // CASE WHEN SENDER IS DIFFERENT, CREATE NEW CHATBLOCK
                    existingChat.chats.push({ sender, messages: [message] })
                }

                await existingChat.save()
            } else {

                // CASE WHEN CHAT DOES NOT EXIST BETWEEN TWO PARTICIPANTS, CREATE NEW DOCUMENT IN DATABASE
                await Chat.create({
                    participant1: sender,
                    participant2: recipient,
                    chats: [
                        {
                            sender,
                            messages: [message]
                        }
                    ]
                })
            }

            // EMIT EVENT TO CLIENT
            socket.to(recipientSocketId).emit('privateMessage', { sender, message });
            console.log(`Message from ${sender} to ${recipient}: ${message}`);
        } else {
            console.log(`User ${recipient} not found`);
        }
    } catch (error) {
        console.log(error);
    }
}