import User from "../models/userModel.js";
import transformUsersWithClerk from "../utils/transformUsersWithClerk.js";
import { clerkClient, io, users } from "../index.js";
import Chat from "../models/chatModel.js";

// GET A USER
export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });

    if (!user) return res.status(404).json({ message: "No user found" });

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// CREATE A USER IF NOT EXISTS
export const createUser = async (req, res) => {
  try {
    const { userId } = req.body;

    try {
      await clerkClient.users.getUser(userId);
    } catch (error) {
      if (error.status == 404) {
        return res
          .status(404)
          .json({ message: `No user found with ID: ${contactId}` });
      }

      throw error;
    }

    let user = await User.findOne({ userId });

    if (!user) {
      user = await User.create({
        userId,
      });
    }

    user = await transformUsersWithClerk(user);

    const connections = await Promise.all(
      user.connections.map(async (connection) => {
        const chat = await Chat.findOne({
          $or: [
            { participant1: user.userId, participant2: connection.id },
            { participant1: connection.id, participant2: user.userId },
          ],
        });

        if (!chat)
          return {
            ...connection,
          };

        const lastChatBlock = chat.chats[chat.chats.length - 1];

        return {
          ...connection,
          lastMessage:
            lastChatBlock.messages[lastChatBlock.messages.length - 1],
        };
      })
    );

    user.connections = connections;

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// SEND A CONTACT REQUEST
export const sendContactRequest = async (req, res) => {
  try {
    const { contactId, userId } = req.body;

    if (contactId == userId) {
      return res
        .status(400)
        .json({ message: "You can't send a connection request to yourself!" });
    }

    try {
      await clerkClient.users.getUser(contactId);
    } catch (error) {
      if (error.status == 404) {
        return res
          .status(404)
          .json({ message: `No user found with ID: ${contactId}` });
      }

      throw error;
    }

    const existingUser = await User.findOne({ userId: contactId });

    if (existingUser.requests.includes(userId)) {
      return res
        .status(409)
        .json({ message: "You have already sent a request to this user." });
    } else if (existingUser.connections.includes(userId)) {
      return res
        .status(409)
        .json({ message: "You are already connected to this user." });
    }

    existingUser.requests.push(userId);
    await existingUser.save();

    const user = await transformUsersWithClerk(existingUser);

    if (users[contactId])
      io.to(users[contactId]).emit("newRequest", { user, contactId: userId });

    res
      .status(200)
      .json({ message: `Contact request sent to ID: ${contactId}` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// UPDATE A CONTACT REQUEST
export const updateContactRequest = async (req, res) => {
  try {
    const { contactId, userId } = req.body;
    const { decision } = req.query;

    const existingFirstUser = await User.findOne({ userId });
    const existingSecondUser = await User.findOne({ userId: contactId });

    if (!existingFirstUser && !existingSecondUser)
      return res.status(404).json({ message: "No user found" });

    existingFirstUser.requests = existingFirstUser.requests.filter(
      (id) => id !== contactId
    );

    if (decision == "accept") {
      existingFirstUser.connections.push(contactId);
      existingSecondUser.connections.push(userId);
    }

    await existingFirstUser.save();
    await existingSecondUser.save();

    let user = await transformUsersWithClerk(existingSecondUser);

    if (users[contactId] && decision == "accept")
      io.to(users[contactId]).emit("requestAccepted", {
        user,
        userId,
      });

    user = await transformUsersWithClerk(existingFirstUser);

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE A CONTACT
export const deleteContact = async (req, res) => {
  try {
    const { contactId, userId } = req.body;

    const existingFirstUser = await User.findOne({ userId });
    const existingSecondUser = await User.findOne({ userId: contactId });

    if (!existingFirstUser || !existingSecondUser)
      return res.status(404).json({ message: "No user found" });

    existingFirstUser.connections = existingFirstUser.connections.filter(
      (id) => id !== contactId
    );

    existingSecondUser.connections = existingSecondUser.connections.filter(
      (id) => id !== userId
    );

    await existingFirstUser.save();
    await existingSecondUser.save();

    res.status(200).json({ user: existingFirstUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
