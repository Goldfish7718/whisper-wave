export interface UserType {
  userId: string;
  requests: {
    id: string;
    image: string;
    name: string;
  }[];
  connections: {
    id: string;
    image: string;
    name: string;
  }[];
}

export interface SelectedContactType {
  contactId: string;
  fullname: string;
  image: string | undefined;
}

export interface ContactCardProps {
  image: string;
  name: string;
  lastMessage?: string;
  time?: string;
}

export interface ConnectionRequestCardProps extends ContactCardProps {
  id: string;
  setOpen: (open: boolean) => void;
}

export interface ChatType {
  participant1: string;
  participant2: string;
  chats: {
    sender: string;
    messages: string[];
  }[];
}

export default interface TriggerProps {
  children: React.ReactNode;
}
