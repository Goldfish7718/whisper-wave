"use client"

import React, { useEffect, useRef, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AudioWaveform, SendHorizonal } from 'lucide-react'
import ContactCard from '@/components/ContactCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { apiInstance } from '../globals'
import { useUser } from '@clerk/nextjs'
import { ChatType, SelectedContactType, UserType } from '@/types/types'
import Loading from '@/components/Loading'
import { connect } from 'socket.io-client'

export const socket = connect(`${process.env.NEXT_PUBLIC_API_URL}`)

const Chat = () => {

    const { user: clerkUser } = useUser()
    const bottomRef = useRef<HTMLDivElement>(null)

    const [user, setUser] = useState<UserType | null>(null);
    const [selectedContact, setSelectedContact] = useState<SelectedContactType | null>(null);
    const [chats, setChats] = useState<ChatType | null>(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const getUser = async () => {
        try {
            setLoading(true)
            const res = await apiInstance.post('/users/create', {
                userId: clerkUser?.id
            })
            
            setUser(res.data.user)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const getChats = async () => {
        try {
            const res = await apiInstance.get(`/chats/get/${clerkUser?.id}/${selectedContact?.contactId}`)            

            console.log(res.data.chats);
            setChats(res.data.chats)
        } catch (error) {
            console.log(error);
        }
    }

    const handleContactSelect = (contactId: string) => {
        const selectedContact = user?.connections.find(connection => connection.id == contactId)

        setSelectedContact({
            contactId,
            fullname: `${selectedContact?.name}`,
            image: selectedContact?.image
        })
    }

    const sendMessage = () => {
        const data = {
            sender: clerkUser?.id,
            recipient: selectedContact?.contactId,
            message
        }

        socket.emit('privateMessage', data)
        setMessage("")
    }

    function getInitials(fullName: string) {
        const words = fullName.split(' ');
        const initials = words.map(word => word[0].toUpperCase()).join('');
        return initials;
    }

    useEffect(() => {
        if (clerkUser) {
            getUser()
            socket.emit('register', { userId: clerkUser?.id })
        }
    }, [clerkUser])

    useEffect(() => {
        if (selectedContact)
            getChats()
    }, [selectedContact])

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [selectedContact, chats?.chats])

    // useEffect(() => {
    //     if (bottomRef.current) {
    //         const parentElement = bottomRef.current.parentElement!;
    //         parentElement.scrollTop = parentElement.scrollHeight + parentElement.clientHeight - (3 * 16); // 3 rem = 48px (16px per rem)
    //     }
    // }, [selectedContact, chats?.chats]);
    

    useEffect(() => {
        socket.on('privateMessage', ({ sender, message }) => {
            console.log(sender, message);
            setChats(prevChats => {
                if (!prevChats) return null;
                const lastChatBlock = prevChats?.chats[prevChats.chats.length - 1];

                if (lastChatBlock?.sender === sender) {
                    // Update the last chat block's messages array
                    const updatedChats = [...prevChats.chats];
                    updatedChats[updatedChats.length - 1] = {
                        ...lastChatBlock,
                        messages: [...lastChatBlock.messages, message]
                    };
    
                    // Return the updated chat list
                    return {
                        ...prevChats,
                        chats: updatedChats
                    };
                } else {
                    // If the sender is different, create a new chat block
                    const newChatBlock = {
                        sender,
                        messages: [message]
                    };
    
                    // Return the updated chat list with the new block
                    return {
                        ...prevChats,
                        chats: [...prevChats.chats, newChatBlock]
                    };
                }
            })
        })

        return () => {
            socket.off('privateMessage');
        };
    }, [])

  return (
    <>
        {/* CONTACTS */}
        <aside className='fixed hidden sm:block sm:w-[300px] md:w-[400px] border-r-[1px] border-neutral-300 dark:border-neutral-800 h-screen'>
            <ScrollArea className='h-full'>
                {!loading && user?.connections.map((contact) => (
                    <div key={contact.id} onClick={() => handleContactSelect(contact.id)}>
                        <ContactCard {...contact} />
                    </div>
                ))}

                {loading &&
                    <div className='w-full h-screen flex justify-center items-center'>
                        <Loading size={48} />
                    </div>
                }
            </ScrollArea>
        </aside>

        {/* CHAT INTERFACE */}
        <section className='sm:ml-[300px] md:ml-[400px]'>

            {/* NO CONVERSATION SELECTED */}
            {!selectedContact &&
                <div className='flex justify-center items-center h-screen bg-neutral-100 dark:bg-neutral-900 z-0'>
                    <div className='fixed flex flex-col items-center gap-1'>
                        <AudioWaveform size={28} className='text-neutral-500' />
                        <h3 className='text-neutral-500 font-medium text-lg'>Select a conversation to get started</h3>
                    </div>
                </div>
            }

            {/* CONVERSATION SELECTED */}
            {selectedContact &&
                <div>
                    <div className='h-screen'>
                        <div className='fixed flex items-center p-2 gap-2 border-b-[1px] border-neutral-300 dark:border-neutral-800 w-full z-10 backdrop-blur-sm'>
                            <Avatar className='h-8 w-8'>
                                <AvatarImage src={selectedContact.image} alt="CN" />
                                <AvatarFallback>{getInitials(selectedContact.fullname)}</AvatarFallback>
                            </Avatar>

                            <h3 className='text-lg'>{selectedContact.fullname}</h3>
                        </div>

                        <ScrollArea className='h-full'>
                            <div className='pt-12 h-full'>
                                {chats?.chats.map((chatBlock, index) => (
                                    <div className={`mx-2 mt-4`} key={index}>
                                        {chatBlock.messages.map((message, messageIndex) => (
                                            <div key={messageIndex} className={`p-3 m-1 bg-neutral-100 dark:bg-neutral-800 max-w-[66.6667%] w-fit rounded-md ${chatBlock.sender === clerkUser?.id ? 'ml-auto' : ''}`}>{message}</div>
                                        ))}
                                    </div>
                                ))}

                                <div ref={bottomRef}></div>
                            </div>
                        </ScrollArea>
                    </div>

                    <div className='flex bottom-0 fixed w-full sm:w-[calc(100%-300px)] md:w-[calc(100%-400px)]'>
                        <Input placeholder='Message...' className='rounded-none' value={message} onChange={e => setMessage(e.target.value)} />
                        <Button className='rounded-none' disabled={!Boolean(message)} onClick={sendMessage}><SendHorizonal size={24} className='mx-1' /></Button>
                    </div>
                </div>
            }
        </section>
    </>
  )
}

export default Chat