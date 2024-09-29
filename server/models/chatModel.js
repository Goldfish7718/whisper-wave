import { model, Schema } from "mongoose";

const chatSchema = new Schema({
  participant1: String,
  participant2: String,
  chats: [
    {
      sender: String,
      messages: [
        {
          messageText: String,
          time: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  ],
});

const Chat = model("Chat", chatSchema);
export default Chat;
