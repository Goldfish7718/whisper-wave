import axios from 'axios'
import io from 'socket.io-client'

export const socket = io(process.env.NEXT_PUBLIC_API_URL as string)
export const apiInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true
})