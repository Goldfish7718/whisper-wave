import React from 'react'
import contacts from '@/data/contacts.json'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { AudioWaveform } from 'lucide-react'

const Chat = () => {

    const truncateString = (message: string) => {
        if (message.length > 50) {
            return `${message.substring(0, 20)}...`
        } 

        return message
    }

  return (
    <>
        {/* CONTACTS */}
        <aside className='fixed w-[400px] border-r-[1px] border-neutral-300 dark:border-neutral-800 h-screen'>
            <ScrollArea className='h-full'>
                {contacts.map(contact => (
                    <>
                        <div className='h-20 py-2 px-6 w-full flex items-center gap-4 hover:cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800' key={contact.id}>
                            <Avatar>
                                <AvatarImage src={contact.image} alt={contact.name} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col w-full'>
                                <div className='flex justify-between items-center'>
                                    <h4 className='text-neutral-800 dark:text-neutral-50'>{contact.name}</h4>
                                    <span className='text-sm text-neutral-400'>{contact.time}</span>
                                </div>
                                <p className='text-neutral-600 dark:text-neutral-300'>{truncateString(contact.lastMessage)}</p>
                            </div>
                        </div>
                        <Separator />
                    </>
                ))}
            </ScrollArea>
        </aside>

        {/* CHAT INTERFACE */}
        <section className='ml-[400px] flex justify-center items-center h-screen bg-neutral-100'>
            <div className='fixed flex flex-col items-center gap-1'>
                <AudioWaveform size={28} className='text-neutral-500 dark:text-neutral-300' />
                <h3 className='text-neutral-500 dark:text-neutral-300 font-medium text-lg'>Select a conversation to get started</h3>
            </div>
        </section>
    </>
  )
}

export default Chat