"use client";

import { apiInstance, socket } from "@/app/globals";
import { UserType } from "@/types/types";
import { useUser } from "@clerk/nextjs";
import { useContext, createContext, useState, useEffect } from "react";
import UserProviderProps from "@/types/types";
import { UserContextType } from "@/types/contextTypes";
import { useToast } from "@/hooks/use-toast";

const UserContext = createContext<UserContextType | null>(null);
export const useExtendedUser = (): UserContextType => {
  return useContext(UserContext) as UserContextType;
};

function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserType | null>(null);

  const [loading, setLoading] = useState(false);
  const [updateLoading, setupdateLoading] = useState(false);

  const { user: clerkUser } = useUser();
  const { toast } = useToast();

  const getUser = async () => {
    try {
      setLoading(true);
      const res = await apiInstance.post("/users/create", {
        userId: clerkUser?.id,
      });

      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const requestSendContactRequest = async (contactId: string) => {
    try {
      const res = await apiInstance.patch("/users/add", {
        userId: clerkUser?.id,
        contactId,
      });

      toast({
        title: res.data.message,
        duration: 3000,
        variant: "success",
      });
    } catch (error: any) {
      console.log(error);
      toast({
        title: error.response.data.message,
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  const requestUpdateConnectionRequest = async (
    decision: string,
    contactId: string
  ) => {
    try {
      setupdateLoading(true);
      const res = await apiInstance.patch(
        `/users/update?decision=${decision}`,
        {
          userId: clerkUser?.id,
          contactId,
        }
      );

      setUser(res.data.user);

      toast({
        title: `Request ${decision == "accept" ? "accepted" : "declined"}`,
        duration: 3000,
        variant: decision == "accept" ? "success" : "destructive",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setupdateLoading(false);
    }
  };

  useEffect(() => {
    if (clerkUser) {
      getUser();
      socket.emit("register", { userId: clerkUser.id });
    }
  }, [clerkUser]);

  useEffect(() => {
    socket.on(
      "newRequest",
      ({ user, contactId }: { user: UserType; contactId: string }) => {
        toast({
          title: `${contactId} sent you a connection request!`,
          duration: 3000,
        });

        setUser(user);
      }
    );

    socket.on(
      "requestAccepted",
      ({ user, userId }: { user: UserType; userId: string }) => {
        toast({
          title: `${userId} accepted your connection request!`,
          duration: 3000,
          variant: "success",
        });

        setUser(user);
      }
    );

    return () => {
      socket.off("newRequest");
      socket.off("requestAccepted");
    };
  }, []);

  const value: UserContextType = {
    user,

    getUser,
    requestUpdateConnectionRequest,
    requestSendContactRequest,

    loading,
    updateLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserProvider;
