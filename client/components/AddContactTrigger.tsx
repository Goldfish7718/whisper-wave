"use client";

import React, { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import TriggerProps from "@/types/types";
import { useExtendedUser } from "@/context/UserContext";

const AddContactTrigger = ({ children }: TriggerProps) => {
  const matches = useMediaQuery("(min-width: 768px)");

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [contactIdToRequest, setcontactIdToRequest] = useState("");

  const { requestSendContactRequest } = useExtendedUser();

  const handleSubmit = async () => {
    setLoading(true);
    await requestSendContactRequest(contactIdToRequest);

    setOpen(false);
    setcontactIdToRequest("");
    setLoading(false);
  };

  if (matches)
    return (
      <>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg">Add New Contact</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2">
              <Input
                placeholder="Enter Contact ID"
                value={contactIdToRequest}
                onChange={(e) => setcontactIdToRequest(e.target.value)}
              />
              <Button
                onClick={handleSubmit}
                disabled={loading || !Boolean(contactIdToRequest)}>
                {!loading && (
                  <>
                    Add <Plus className="mx-1" size={18} />
                  </>
                )}
                {loading && <Loader2 className="animate-spin duration-300" />}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  else
    return (
      <>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>{children}</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-lg">Add New Contact</DrawerTitle>
            </DrawerHeader>
            <div className="flex gap-2 p-4">
              <Input
                placeholder="Enter Contact ID"
                value={contactIdToRequest}
                onChange={(e) => setcontactIdToRequest(e.target.value)}
              />
              <Button
                onClick={handleSubmit}
                disabled={loading || !Boolean(contactIdToRequest)}>
                {!loading && (
                  <>
                    Add <Plus className="mx-1" size={18} />
                  </>
                )}
                {loading && <Loader2 className="animate-spin duration-300" />}
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
};

export default AddContactTrigger;
