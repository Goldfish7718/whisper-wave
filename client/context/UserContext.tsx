"use client";

import { apiInstance } from "@/app/globals";
import { UserType } from "@/types/types";
import { useUser } from "@clerk/nextjs";
import { useContext, createContext, useState, useEffect } from "react";

interface UserProviderProps {
  children: React.ReactNode;
}

interface UserContextType {
  // DATA
  user: UserType | null;

  // FUNCTIONS
  getUser: () => void;

  // OTHER
  loading: boolean;
}

const UserContext = createContext<UserContextType | null>(null);
export const useExtendedUser = (): UserContextType => {
  return useContext(UserContext) as UserContextType;
};

function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);

  const { user: clerkUser } = useUser();

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

  useEffect(() => {
    if (clerkUser) getUser();
  }, [clerkUser]);

  const value: UserContextType = {
    user,
    getUser,
    loading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserProvider;
