import { createClerkClient } from "@clerk/backend";
import User from "../models/userModel.js";

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

export const createUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const clerkClient = createClerkClient({
      secretKey: `${process.env.CLERK_SECRET_KEY}`,
    });

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
    let connections = [];
    let requests = [];

    if (!user) {
      user = await User.create({
        userId,
      });
    }

    if (user.connections.length > 0) {
      connections = (
        await clerkClient.users.getUserList({ userId: user.connections })
      ).data;
      connections = connections.map((connection) => {
        return {
          id: connection.id,
          image: connection.imageUrl,
          name: `${connection.firstName} ${connection.lastName}`,
        };
      });
    }

    if (user.requests.length > 0) {
      requests = (
        await clerkClient.users.getUserList({ userId: user.requests })
      ).data;
      requests = requests.map((request) => {
        return {
          id: request.id,
          image: request.imageUrl,
          name: `${request.firstName} ${request.lastName}`,
        };
      });
    }

    user = {
      ...user.toObject(),
      connections,
      requests,
    };

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendContactRequest = async (req, res) => {
  try {
    const { contactId, userId } = req.body;

    const clerkClient = createClerkClient({
      secretKey: `${process.env.CLERK_SECRET_KEY}`,
    });

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

    const existingUser = await User.findOne({ userId });

    existingUser.requests.push(contactId);
    await existingUser.save();

    res
      .status(200)
      .json({ message: `Contact request sent to ID: ${contactId}` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

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

    res.status(200).json({ user: existingFirstUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

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
