import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "./ui/drawer"
import { ScrollArea } from "./ui/scroll-area"
import contacts from '@/data/contacts.json'
import ContactCard from "./ContactCard"

const ContactsDrawer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Drawer>
        <DrawerTrigger asChild>
            {children}
        </DrawerTrigger>
        <DrawerContent className="h-[500px]">
            <ScrollArea className='h-full mt-2'>
                    {contacts.map(contact => (
                        <DrawerClose asChild>
                            <div key={contact.id}>
                                <ContactCard {...contact} />
                            </div>
                        </DrawerClose>
                    ))}
            </ScrollArea>
        </DrawerContent>
    </Drawer>
  )
}

export default ContactsDrawer