"use client";

import TriggerProps from "@/types/types";
import React, { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { copyToClipboard, getInitials } from "@/utils";
import { Button } from "./ui/button";
import { Clipboard, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "./ui/drawer";

const ProfileTrigger = ({ children }: TriggerProps) => {
  const matches = useMediaQuery("(min-width: 768px)");
  const { user } = useUser();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    copyToClipboard(user?.id as string);
    toast({
      title: "Copied to clipboard!",
      variant: "success",
      duration: 3000,
    });
  };

  if (matches)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <div className="p-4">
            <div className="flex gap-8 items-center">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={user?.imageUrl}
                  alt={user?.fullName as string}
                />
                <AvatarFallback>
                  {user?.fullName && getInitials(user?.fullName)}
                </AvatarFallback>
              </Avatar>

              <div>
                <h3>{user?.fullName}</h3>
                <div className="flex gap-4 items-center">
                  <span className="text-neutral-500">{user?.id}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-2 text-neutral-500 text-[12px]"
                    onClick={handleCopy}>
                    <Clipboard size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <SignOutButton>
              <Button variant="destructive" className="w-full">
                <LogOut size={18} className="mx-2" />
                <span>Log Out</span>
              </Button>
            </SignOutButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  else
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <div className="flex gap-8 items-center p-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={user?.imageUrl}
                alt={user?.fullName as string}
              />
              <AvatarFallback>
                {user?.fullName && getInitials(user?.fullName)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3>{user?.fullName}</h3>
              <div className="flex flex-col gap-1 justify-start my-2">
                <span className="text-neutral-500">{user?.id}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="p-2 text-neutral-500 text-[12px] w-fit"
                  onClick={handleCopy}>
                  <Clipboard size={14} />
                </Button>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <SignOutButton>
              <Button variant="destructive" className="w-full">
                <LogOut size={18} className="mx-2" />
                <span>Log Out</span>
              </Button>
            </SignOutButton>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
};

export default ProfileTrigger;
