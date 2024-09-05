import { createClerkClient } from '@clerk/backend'
import User from '../models/userModel.js';

export const getUser = async (req, res) => {
    try {
        const { userId } = req.params        
        const user = await User.findOne({ userId })

        if (!user)
            return res
                .status(404)
                .json({ message: "No user found" })

        res
            .status(200)
            .json({ user })
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export const createUser = async (req, res) => {
    try {
        const { userId } = req.body
        const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
        console.log(userId);

        try {
            await clerkClient.users.getUser(userId)
        } catch (error) {
            if (error.status == 404) {
                return res
                    .status(404)
                    .json({ message: `No user found with ID: ${contactId}` })
            }

            throw error
        }

        let user = await User.findOne({ userId })
        let connections;

        if (!user) {
            user = await User.create({
                userId
            })
        } 
        
        if (user.connections.length > 0) {
            connections = (await clerkClient.users.getUserList({ userId: user.connections })).data
            connections = connections.map(connection => {
                return {
                    id: connection.id,
                    image: connection.imageUrl,
                    name: `${connection.firstName} ${connection.lastName}`
                }
            })
        }

        user = {
            ...user.toObject(),
            connections
        }

        res
            .status(200)
            .json({ user })
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export const sendContactRequest = async (req, res) => {
    try {
        const { contactId, userId } = req.body;

        try {
            await clerkClient.users.getUser(contactId)
        } catch (error) {
            if (error.status == 404) {
                return res
                    .status(404)
                    .json({ message: `No user found with ID: ${contactId}` })
            }

            throw error
        }

        const existingUser = await User.findOne({ userId })

        existingUser.requests.push(contactId)
        await existingUser.save()

        res
            .status(200)
            .json({ message: `Contact request sent to ID: ${contactId}` })
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export const acceptContactRequest = async (req, res) => {
    try {
        const { contactId, userId } = req.body

        const existingUser = await User.findOne({ userId })
        
        if (!existingUser)
            return res
                .status(404)
                .json({ message: "No user found" })

        console.log(existingUser.connections);

        existingUser.requests = existingUser.requests.filter(id => id !== contactId)
        existingUser.connections.push(contactId) 

        await existingUser.save()

        res
            .status(200)
            .json({ user: existingUser })
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}


export const deleteContact = async (req, res) => {
    try {
        const { contactId, userId } = req.body

        const existingUser = await User.findOne({ userId })
        
        if (!existingUser)
            return res
                .status(404)
                .json({ message: "No user found" })

        existingUser.connections = existingUser.connections.filter(id => id !== contactId)

        await existingUser.save()

        res
            .status(200)
            .json({ user: existingUser })
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}