import { ChatType, SelectedContactType, UserType } from "./types";

export interface ChatContextType {
  // DATA
  selectedContact: SelectedContactType | null;
  chats: ChatType | null;

  // FUNCTIONS
  handleContactSelect: (contactId: string) => void;
  getChats: () => void;
  sendMessage: (message: string) => void;

  // OTHER
}

export interface UserContextType {
  // DATA
  user: UserType | null;

  // FUNCTIONS
  getUser: () => void;
  requestUpdateConnectionRequest: (decision: string, contactId: string) => void;

  // OTHER
  loading: boolean;
  updateLoading: boolean;
}
