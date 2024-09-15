import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";
import { useExtendedUser } from "@/context/UserContext";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useChat } from "@/context/ChatContext";

const ContactsDrawer = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useExtendedUser();
  const { handleContactSelect } = useChat();

  const truncateString = (message: string) => {
    if (message.length > 50) {
      return `${message.substring(0, 20)}...`;
    }

    return message;
  };

  return (
    <Drawer>
      {!loading && user && <DrawerTrigger asChild>{children}</DrawerTrigger>}
      <DrawerContent className="h-[500px]">
        <ScrollArea className="h-full mt-2">
          {user?.connections.map((contact) => (
            <div
              key={contact.id}
              onClick={() => handleContactSelect(contact.id)}>
              <>
                <DrawerClose asChild>
                  <div className="h-20 py-2 px-6 w-full flex items-center gap-4 hover:cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    <Avatar>
                      <AvatarImage src={contact.image} alt={contact.name} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col w-full">
                      <div className="flex justify-between items-center">
                        <h4 className="text-neutral-800 dark:text-neutral-50">
                          {contact.name}
                        </h4>
                        {/* {contact.time && (
                          <span className="text-sm text-neutral-400">
                            {contact.time}
                          </span>
                        )} */}
                      </div>
                      {/* {contact.lastMessage && (
                        <p className="text-neutral-600 dark:text-neutral-300">
                          {truncateString(contact.lastMessage)}
                        </p>
                      )} */}
                    </div>
                  </div>
                </DrawerClose>
                <Separator />
              </>
            </div>
          ))}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default ContactsDrawer;
