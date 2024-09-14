import { ContactCardProps } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";

const ContactCard = (contact: ContactCardProps) => {
  const truncateString = (message: string) => {
    if (message.length > 50) {
      return `${message.substring(0, 20)}...`;
    }

    return message;
  };

  return (
    <>
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
            {contact.time && (
              <span className="text-sm text-neutral-400">{contact.time}</span>
            )}
          </div>
          {contact.lastMessage && (
            <p className="text-neutral-600 dark:text-neutral-300">
              {truncateString(contact.lastMessage)}
            </p>
          )}
        </div>
      </div>
      <Separator />
    </>
  );
};

export default ContactCard;
