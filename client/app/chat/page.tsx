"use client";

import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AudioWaveform, SendHorizonal } from "lucide-react";
import ContactCard from "@/components/ContactCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiInstance } from "../globals";
import { useUser } from "@clerk/nextjs";
import Loading from "@/components/Loading";
import { connect } from "socket.io-client";
import { useExtendedUser } from "@/context/UserContext";
import { useChat } from "@/context/ChatContext";

export const socket = connect(`${process.env.NEXT_PUBLIC_API_URL}`);

const Chat = () => {
  const { user: clerkUser } = useUser();
  const { loading, user } = useExtendedUser();
  const { selectedContact, handleContactSelect, chats, getChats } = useChat();

  const bottomRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState("");

  function getInitials(fullName: string) {
    const words = fullName.split(" ");
    const initials = words.map((word) => word[0].toUpperCase()).join("");
    return initials;
  }

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, [chats, selectedContact]);

  useEffect(() => {
    if (selectedContact) {
      getChats();
    }
  }, [selectedContact]);

  //   useEffect(() => {
  //     socket.on("privateMessage", ({ sender, message }) => {
  //       console.log(sender, message);
  //       setChats((prevChats) => {
  //         if (!prevChats) return null;
  //         const lastChatBlock = prevChats?.chats[prevChats.chats.length - 1];

  //         if (lastChatBlock?.sender === sender) {
  //           // Update the last chat block's messages array
  //           const updatedChats = [...prevChats.chats];
  //           updatedChats[updatedChats.length - 1] = {
  //             ...lastChatBlock,
  //             messages: [...lastChatBlock.messages, message],
  //           };

  //           // Return the updated chat list
  //           return {
  //             ...prevChats,
  //             chats: updatedChats,
  //           };
  //         } else {
  //           // If the sender is different, create a new chat block
  //           const newChatBlock = {
  //             sender,
  //             messages: [message],
  //           };

  //           // Return the updated chat list with the new block
  //           return {
  //             ...prevChats,
  //             chats: [...prevChats.chats, newChatBlock],
  //           };
  //         }
  //       });
  //     });

  //     return () => {
  //       socket.off("privateMessage");
  //     };
  //   }, []);

  return (
    <>
      {/* CONTACTS */}
      <aside className="fixed hidden sm:block sm:w-[300px] md:w-[400px] border-r-[1px] border-neutral-300 dark:border-neutral-800 h-screen">
        <ScrollArea className="h-full">
          {!loading &&
            user?.connections.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleContactSelect(contact.id)}>
                <ContactCard {...contact} />
              </div>
            ))}

          {loading && (
            <div className="w-full h-screen flex justify-center items-center">
              <Loading size={48} />
            </div>
          )}
        </ScrollArea>
      </aside>

      {/* CHAT INTERFACE */}
      <section className="sm:ml-[300px] md:ml-[400px]">
        {/* NO CONVERSATION SELECTED */}
        {!selectedContact && (
          <div className="flex justify-center items-center h-screen bg-neutral-100 dark:bg-neutral-900 z-0">
            <div className="fixed flex flex-col items-center gap-1">
              <AudioWaveform size={28} className="text-neutral-500" />
              <h3 className="text-neutral-500 font-medium text-lg">
                Select a conversation to get started
              </h3>
            </div>
          </div>
        )}

        {/* CONVERSATION SELECTED */}
        {selectedContact && (
          <div>
            <div className="h-screen">
              <div className="fixed flex items-center p-2 gap-2 border-b-[1px] border-neutral-300 dark:border-neutral-800 w-full z-10 backdrop-blur-sm">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedContact.image} alt="CN" />
                  <AvatarFallback>
                    {getInitials(selectedContact.fullname)}
                  </AvatarFallback>
                </Avatar>

                <h3 className="text-lg">Tejas Nanoti</h3>
              </div>

              {/* CONVERSATION */}
              <ScrollArea className="h-full">
                <div className="py-12 h-full">
                  {chats?.chats.map((chatBlock, index) => (
                    <div
                      className={`mx-2 mt-4 ${index == 0 ? "mt-20" : ""}`}
                      key={index}>
                      {chatBlock.messages.map((message, messageIndex) => (
                        <div
                          key={messageIndex}
                          className={`p-3 m-1 bg-neutral-100 dark:bg-neutral-800 max-w-[66.6667%] w-fit rounded-md ${
                            chatBlock.sender === clerkUser?.id ? "ml-auto" : ""
                          }`}>
                          {message}
                        </div>
                      ))}
                    </div>
                  ))}

                  <div ref={bottomRef}></div>
                </div>
              </ScrollArea>
            </div>

            <div className="flex bottom-0 fixed w-full sm:w-[calc(100%-300px)] md:w-[calc(100%-400px)]">
              <Input
                placeholder="Message..."
                className="rounded-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="bg-white dark:bg-black">
                <Button className="rounded-none " disabled={!Boolean(message)}>
                  <SendHorizonal size={24} className="mx-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Chat;
