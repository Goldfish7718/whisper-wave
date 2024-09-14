import { SelectedContactType, UserType } from "./types";

export interface ChatContextType {
    // DATA
    selectedContact: SelectedContactType | null;
  
    // FUNCTIONS
    handleContactSelect: (contactId: string) => void;
    // OTHER
}

export interface UserContextType {
    // DATA
    user: UserType | null;
  
    // FUNCTIONS
    getUser: () => void;
  
    // OTHER
    loading: boolean;
}