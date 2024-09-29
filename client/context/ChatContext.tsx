"use client";

import { useContext, createContext, useState, useEffect } from "react";
import { useExtendedUser } from "./UserContext";
import { ChatType, SelectedContactType } from "@/types/types";
import ChatProviderProps from "@/types/types";
import { ChatContextType } from "@/types/contextTypes";
import { apiInstance } from "@/app/globals";
import { useUser } from "@clerk/nextjs";
import { socket } from "@/app/globals";
import { toast } from "@/hooks/use-toast";
import { truncateString } from "@/utils";

const ChatContext = createContext<ChatContextType | null>(null);
export const useChat = (): ChatContextType => {
  return useContext(ChatContext) as ChatContextType;
};

function ChatProvider({ children }: ChatProviderProps) {
  const { user } = useExtendedUser();
  const { user: clerkUser } = useUser();

  const [selectedContact, setSelectedContact] =
    useState<SelectedContactType | null>(null);

  const [chats, setChats] = useState<ChatType | null>(null);
  const [chatLoading, setchatLoading] = useState(false);

  const handleContactSelect = (contactId: string) => {
    setChats(null);
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
      setchatLoading(true);
      const res = await apiInstance.get(
        `/chats/get/${clerkUser?.id}/${selectedContact?.contactId}`
      );

      setChats(res.data.chats);
    } catch (error) {
      console.log(error);
    } finally {
      setchatLoading(false);
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
    if (user) {
      socket.on("privateMessage", ({ sender, newMessageObj }) => {
        if (
          !selectedContact ||
          (sender !== clerkUser?.id && sender !== selectedContact?.contactId)
        ) {
          toast({
            title: user?.connections.find(
              (connection) => connection.id == sender
            )?.name,
            description: truncateString(newMessageObj.messageText, 100),
            duration: 5000,
          });
        }

        if (sender !== clerkUser?.id && sender !== selectedContact?.contactId) {
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
              messages: [...lastChatBlock.messages, newMessageObj],
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
              messages: [newMessageObj],
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
  }, [selectedContact, user]);

  useEffect(() => {
    if (selectedContact) {
      getChats();
    }
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
    chatLoading,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export default ChatProvider;
