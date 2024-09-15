import React from "react";
import { useMediaQuery } from "usehooks-ts";
import { Popover, PopoverTrigger } from "./ui/popover";
import TriggerProps from "@/types/types";
import { PopoverContent } from "@radix-ui/react-popover";
import { ScrollArea } from "./ui/scroll-area";
import contacts from "@/data/contacts.json";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ContactCardProps } from "@/types/types";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";

const ConnectionRequestCard = ({ name, image }: ContactCardProps) => {
  return (
    <Card className="m-2">
      <CardContent className="p-4 flex justify-between">
        <div className="flex gap-2 items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src={image} alt="CN" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <h5>{name}</h5>
        </div>

        <div className="flex gap-2">
          <Button size="sm">Accept</Button>
          <Button size="sm" variant="outline">
            Decline
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const NotificationsTrigger = ({ children }: TriggerProps) => {
  const matches = useMediaQuery("(min-width: 768px)");

  if (matches)
    return (
      <Popover>
        <PopoverTrigger>{children}</PopoverTrigger>
        <PopoverContent className="h-[50vh] w-[70vh] bg-white border-[1px] border-neutral-300 dark:border-neutral-800 rounded-lg m-1">
          <div className="p-2 border-b-[1px] border-neutral-300 dark:border-neutral-800 h-full">
            <h3 className="font-bold text-lg">Notifications</h3>
            <ScrollArea className="h-[90%]">
              {contacts.map((contact) => (
                <ConnectionRequestCard key={contact.id} {...contact} />
              ))}
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
    );
  else
    return (
      <Drawer>
        <DrawerTrigger>{children}</DrawerTrigger>
        <DrawerContent className="h-[500px]">
          <div className="p-2 border-b-[1px] border-neutral-300 dark:border-neutral-800 h-full">
            <h3 className="font-bold text-lg">Notifications</h3>
            <ScrollArea className="h-[90%]">
              {contacts.map((contact) => (
                <ConnectionRequestCard key={contact.id} {...contact} />
              ))}
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>
    );
};

export default NotificationsTrigger;
