"use client"

import React from 'react'
import contacts from '@/data/contacts.json'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AudioWaveform, SendHorizonal } from 'lucide-react'
import ContactCard from '@/components/ContactCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import chatData from '@/data/chatData.json'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const Chat = () => {
  return (
    <>
        {/* CONTACTS */}
        <aside className='fixed hidden sm:block sm:w-[300px] md:w-[400px] border-r-[1px] border-neutral-300 dark:border-neutral-800 h-screen'>
            <ScrollArea className='h-full'>
                {contacts.map(contact => (
                    <div key={contact.id}>
                        <ContactCard {...contact} />
                    </div>
                ))}
            </ScrollArea>
        </aside>

        {/* CHAT INTERFACE */}
        <section className='sm:ml-[300px] md:ml-[400px]'>

            {/* NO CONVERWSATION SELECTED */}
            {/* <div className='flex justify-center items-center h-screen bg-neutral-100 dark:bg-neutral-900'>
                <div className='fixed flex flex-col items-center gap-1'>
                    <AudioWaveform size={28} className='text-neutral-500' />
                    <h3 className='text-neutral-500 font-medium text-lg'>Select a conversation to get started</h3>
                </div>
            </div> */}

            {/* CONVERSATION SELECTED */}
            <div className='h-screen'>
                <div className='fixed flex items-center p-2 gap-2 border-b-[1px] border-neutral-300 dark:border-neutral-800 w-full z-10 backdrop-blur-sm'>
                    <Avatar className='h-8 w-8'>
                        <AvatarImage src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/8f94f7d9-b68a-445e-a003-eceb64087873/dcsohgg-6068e5ed-b130-4e90-9d0e-2818ffef14bb.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzhmOTRmN2Q5LWI2OGEtNDQ1ZS1hMDAzLWVjZWI2NDA4Nzg3M1wvZGNzb2hnZy02MDY4ZTVlZC1iMTMwLTRlOTAtOWQwZS0yODE4ZmZlZjE0YmIuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.dxqnkfCNycNrkqzRpEXcx_7Py_LuhvSDunFDufPyBDM" alt="CN" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <h3>John Doe</h3>
                </div>

                <ScrollArea className='h-full'>
                    <div className='py-12 h-full'>
                        {chatData.map((chatBlock, index) => (
                            <div className={`mx-2 my-4  ${index == chatData.length - 1 ? 'mb-20' : ''}`} key={index}>
                                {chatBlock.messages.map((message, messageIndex) => (
                                    <div key={messageIndex} className={`p-3 m-1 bg-neutral-100 dark:bg-neutral-800 max-w-[66.6667%] w-fit rounded-md ${index % 2 == 0 ? 'ml-auto' : ''}`}>{message}</div>
                                ))}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            <div className='flex bottom-0 fixed w-full sm:w-[calc(100%-300px)] md:w-[calc(100%-400px)]'>
                <Input placeholder='Message...' className='rounded-none' />
                <Button className='rounded-none'><SendHorizonal size={24} className='mx-1' /></Button>
            </div>
        </section>
    </>
  )
}

export default Chat