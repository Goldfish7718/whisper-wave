"use client";

import React, { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import TriggerProps, { ConnectionRequestCardProps } from "@/types/types";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { useExtendedUser } from "@/context/UserContext";
import Loading from "./Loading";

const ConnectionRequestCard = ({
  name,
  image,
  id: contactId,
  setOpen,
}: ConnectionRequestCardProps) => {
  const { requestUpdateConnectionRequest, updateLoading } = useExtendedUser();

  const handleSubmit = async (decision: string, contactId: string) => {
    await requestUpdateConnectionRequest(decision, contactId);
    setOpen(false);
  };

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
          {!updateLoading && (
            <>
              <Button
                size="sm"
                onClick={() => handleSubmit("accept", contactId)}>
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSubmit("decline", contactId)}>
                Decline
              </Button>
            </>
          )}
          {updateLoading && (
            <div className="h-full flex items-center mx-4">
              <Loading size={24} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const NotificationsTrigger = ({ children }: TriggerProps) => {
  const matches = useMediaQuery("(min-width: 768px)");
  const { user } = useExtendedUser();

  const [open, setOpen] = useState(false);

  if (matches)
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="h-[50vh] w-[70vh] rounded-lg m-1">
          <h3 className="font-bold text-lg">Notifications</h3>
          {user?.requests && user.requests.length > 0 ? (
            <ScrollArea className="h-[90%]">
              {user?.requests.map((contact) => (
                <ConnectionRequestCard
                  key={contact.id}
                  {...contact}
                  setOpen={setOpen}
                />
              ))}
            </ScrollArea>
          ) : (
            <div className="h-full flex justify-center items-center">
              <h4 className="text-neutral-300 dark:text-neutral-600">
                No Notifications
              </h4>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  else
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="h-[500px]">
          <div className="p-2 py-4 h-full">
            <h4 className="font-bold my-2">Notifications</h4>
            {user?.requests && user.requests.length > 0 ? (
              <ScrollArea className="h-[90%]">
                {user?.requests.map((contact) => (
                  <ConnectionRequestCard
                    key={contact.id}
                    {...contact}
                    setOpen={setOpen}
                  />
                ))}
              </ScrollArea>
            ) : (
              <div className="h-full flex justify-center items-center">
                <h4 className="text-neutral-300 dark:text-neutral-600">
                  No Notifications
                </h4>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    );
};

export default NotificationsTrigger;
