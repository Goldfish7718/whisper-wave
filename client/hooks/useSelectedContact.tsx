import { useExtendedUser } from "@/context/UserContext";
import { SelectedContactType } from "@/types/types";
import { useState } from "react";

const useSelectedContact = () => {
  const { user } = useExtendedUser();
  const [selectedContact, setSelectedContact] =
    useState<SelectedContactType | null>(null);

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

  return {
    selectedContact,
    handleContactSelect,
  };
};

export default useSelectedContact;
