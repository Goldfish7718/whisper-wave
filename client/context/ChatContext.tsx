"use client";

import { useContext, createContext, useState, useEffect } from "react";
import { useExtendedUser } from "./UserContext";
import { ChatType, SelectedContactType } from "@/types/types";
import ChatProviderProps from "@/types/types";
import { ChatContextType } from "@/types/contextTypes";
import { apiInstance } from "@/app/globals";
import { useUser } from "@clerk/nextjs";
import { socket } from "@/app/globals";

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

      setChats(res.data.chats);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (message: string) => {
    socket.emit("privateMessage", {
      sender: clerkUser?.id,
      recipient: selectedContact?.contactId,
      message,
    });
  };

  useEffect(() => {
    if (selectedContact) {
      socket.on("privateMessage", ({ sender, message }) => {
        if (sender !== clerkUser?.id && sender !== selectedContact.contactId) {
          return;
        }

        setChats((prevChats) => {
          if (!prevChats) return null;
          const lastChatBlock = prevChats?.chats[prevChats.chats.length - 1];

          if (lastChatBlock?.sender === sender) {
            // Update the last chat block's messages array
            const updatedChats = [...prevChats.chats];
            updatedChats[updatedChats.length - 1] = {
              ...lastChatBlock,
              messages: [...lastChatBlock.messages, message],
            };

            // Return the updated chat list
            return {
              ...prevChats,
              chats: updatedChats,
            };
          } else {
            // If the sender is different, create a new chat block
            const newChatBlock = {
              sender,
              messages: [message],
            };

            // Return the updated chat list with the new block
            return {
              ...prevChats,
              chats: [...prevChats.chats, newChatBlock],
            };
          }
        });
      });
    }

    return () => {
      socket.off("privateMessage");
    };
  }, [selectedContact]);

  const value: ChatContextType = {
    // DATA
    selectedContact,
    chats,

    // FUNCTIONS
    handleContactSelect,
    getChats,
    sendMessage,

    // OTHER
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export default ChatProvider;
