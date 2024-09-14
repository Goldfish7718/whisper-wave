"use client";

import { useContext, createContext, useState, useEffect } from "react";
import { useExtendedUser } from "./UserContext";
import { SelectedContactType } from "@/types/types";

interface ChatProviderProps {
  children: React.ReactNode;
}

interface ChatContextType {
  // DATA
  selectedContact: SelectedContactType | null;

  // FUNCTIONS
  handleContactSelect: (contactId: string) => void;
  // OTHER
}

const ChatContext = createContext<ChatContextType | null>(null);
export const useChat = (): ChatContextType => {
  return useContext(ChatContext) as ChatContextType;
};

function ChatProvider({ children }: ChatProviderProps) {
  const [selectedContact, setSelectedContact] =
    useState<SelectedContactType | null>(null);
  const { user } = useExtendedUser();

  const handleContactSelect = (contactId: string) => {
    const selectedContact = user?.connections.find(
      (connection) => connection.id == contactId
    );

    setSelectedContact({
      contactId,
      fullname: `${selectedContact?.name}`,
      image: selectedContact?.image,
    });

    console.log({
      contactId,
      fullname: `${selectedContact?.name}`,
      image: selectedContact?.image,
    });
  };

  const value: ChatContextType = {
    selectedContact,
    handleContactSelect,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export default ChatProvider;
