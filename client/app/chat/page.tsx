import React from 'react'
import contacts from '@/data/contacts.json'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AudioWaveform } from 'lucide-react'
import ContactCard from '@/components/ContactCard'

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
        <section className='ml-0 sm:ml-[300px] md:ml-[400px] flex justify-center items-center h-screen bg-neutral-100 dark:bg-neutral-900'>
            <div className='fixed flex flex-col items-center gap-1'>
                <AudioWaveform size={28} className='text-neutral-500' />
                <h3 className='text-neutral-500 font-medium text-lg'>Select a conversation to get started</h3>
            </div>
        </section>
    </>
  )
}

export default Chat