import { model, Schema } from "mongoose";

const userSchema = new Schema({
    userId: String,
    connections: [String],
    requests: [String]
})

const User = model('User', userSchema)
export default User