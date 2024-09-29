import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";
import { useExtendedUser } from "@/context/UserContext";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useChat } from "@/context/ChatContext";
import { getInitials } from "@/utils";
import ContactCard from "./ContactCard";

const ContactsDrawer = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useExtendedUser();
  const { handleContactSelect } = useChat();

  return (
    <Drawer>
      {!loading && user && <DrawerTrigger asChild>{children}</DrawerTrigger>}
      <DrawerContent className="h-[500px]">
        <ScrollArea className="h-full mt-2">
          {user?.connections.map((contact) => (
            <div key={contact.id}>
              <DrawerClose asChild>
                <div
                  className="w-full"
                  onClick={() => handleContactSelect(contact.id)}>
                  <ContactCard {...contact} />
                </div>
              </DrawerClose>
              <Separator />
            </div>
          ))}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default ContactsDrawer;
