import { model, Schema } from "mongoose";

const chatSchema = new Schema({
    participant1: String,
    participant2: String,
    chats: [
        {
            sender: String,
            messages: [String]
        }
    ]
})

const Chat = model('Chat', chatSchema)
export default Chat