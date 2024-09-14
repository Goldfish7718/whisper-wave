"use client";

import { useContext, createContext, useState, useEffect } from "react";
import { useExtendedUser } from "./UserContext";
import { ChatType, SelectedContactType } from "@/types/types";
import ChatProviderProps from "@/types/types";
import { ChatContextType } from "@/types/contextTypes";
import { apiInstance } from "@/app/globals";
import { useUser } from "@clerk/nextjs";
import { socket } from "@/app/chat/page";

const ChatContext = createContext<ChatContextType | null>(null);
export const useChat = (): ChatContextType => {
  return useContext(ChatContext) as ChatContextType;
};

function ChatProvider({ children }: ChatProviderProps) {
  const [selectedContact, setSelectedContact] =
    useState<SelectedContactType | null>(null);
  const [chats, setChats] = useState<ChatType | null>(null);

  const { user } = useExtendedUser();
  const { user: clerkUser } = useUser();

  const handleContactSelect = (contactId: string) => {
    const selectedContact = user?.connections.find(
      (connection) => connection.id == contactId
    );

    setSelectedContact({
      contactId,
      fullname: `${selectedContact?.name}`,
      image: selectedContact?.image,
    });
  };

  const getChats = async () => {
    try {
      const res = await apiInstance.get(
        `/chats/get/${clerkUser?.id}/${selectedContact?.contactId}`
      );

      console.log(res.data.chats);
      setChats(res.data.chats);
    } catch (error) {
      console.log(error);
    }
  };

  const value: ChatContextType = {
    // DATA
    selectedContact,
    chats,

    // FUNCTIONS
    handleContactSelect,
    getChats,

    // OTHER
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export default ChatProvider;
