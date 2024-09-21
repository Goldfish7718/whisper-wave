"use client";

import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AudioWaveform, SendHorizonal } from "lucide-react";
import ContactCard from "@/components/ContactCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Loading from "@/components/Loading";
import { useExtendedUser } from "@/context/UserContext";
import { useChat } from "@/context/ChatContext";
import { getInitials } from "@/utils";

const Chat = () => {
  const { user: clerkUser } = useUser();
  const { loading, user } = useExtendedUser();
  const inputRef = useRef<HTMLInputElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const {
    selectedContact,
    handleContactSelect,
    chats,
    sendMessage,
    chatLoading,
  } = useChat();

  const [message, setMessage] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && message) {
      sendButtonRef.current?.click();
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, [chats, selectedContact]);

  return (
    <>
      {/* CONTACTS */}
      <aside className="fixed hidden sm:block sm:w-[300px] md:w-[400px] border-r-[1px] border-neutral-300 dark:border-neutral-800 h-[calc(100dvh-72px)]">
        {!loading && (
          <ScrollArea className="h-full">
            {user?.connections.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleContactSelect(contact.id)}>
                <ContactCard {...contact} />
              </div>
            ))}
          </ScrollArea>
        )}

        {loading && (
          <div className="w-full h-full flex justify-center items-center">
            <Loading size={48} />
          </div>
        )}
      </aside>

      {/* CHAT INTERFACE */}
      <section className="sm:ml-[300px] md:ml-[400px] h-[calc(100dvh-72px)]">
        {/* NO CONVERSATION SELECTED */}
        {!selectedContact && (
          <div className="flex justify-center items-center h-full bg-neutral-100 dark:bg-neutral-900">
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
          <div className="h-full">
            <div className="fixed flex items-center p-2 gap-2 border-b-[1px] border-neutral-300 dark:border-neutral-800 w-full z-10 backdrop-blur-sm">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={selectedContact.image}
                  alt={selectedContact.fullname}
                />
                <AvatarFallback>
                  {getInitials(selectedContact.fullname)}
                </AvatarFallback>
              </Avatar>

              <h3 className="text-lg">{selectedContact.fullname}</h3>
            </div>

            {/* CONVERSATION */}
            {!chatLoading && (
              <ScrollArea className="h-full">
                <div className="h-full  mt-14 sm:mb-12 mb-10">
                  {chats?.chats.map((chatBlock, index) => (
                    <div className="mx-2" key={index}>
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
            )}

            {chatLoading && (
              <div className="h-full flex justify-center items-center">
                <Loading size={48} />
              </div>
            )}

            <div className="flex bottom-0 fixed w-full sm:w-[calc(100%-300px)] md:w-[calc(100%-400px)]">
              <Input
                placeholder="Message..."
                className="rounded-none"
                value={message}
                ref={inputRef}
                onKeyDown={handleKeyPress}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="bg-white dark:bg-black">
                <Button
                  className="rounded-none "
                  disabled={!Boolean(message)}
                  ref={sendButtonRef}
                  onClick={() => {
                    sendMessage(message);
                    setMessage("");
                  }}>
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
