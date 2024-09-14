import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";
import contacts from "@/data/contacts.json";
import ContactCard from "./ContactCard";
import { useExtendedUser } from "@/context/UserContext";

const ContactsDrawer = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useExtendedUser();
  return (
    <Drawer>
      {!loading && user && <DrawerTrigger asChild>{children}</DrawerTrigger>}
      <DrawerContent className="h-[500px]">
        <ScrollArea className="h-full mt-2">
          {user?.connections.map((contact) => (
            <div key={contact.id}>
              <DrawerClose asChild>
                <ContactCard {...contact} />
              </DrawerClose>
            </div>
          ))}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default ContactsDrawer;
