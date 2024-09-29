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
    lastMessage: {
      messageText: string;
      time: Date;
    };
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
  lastMessage?: {
    messageText: string;
    time: Date;
  };
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
    messages: {
      messageText: string;
      time: Date;
    }[];
  }[];
}

export default interface TriggerProps {
  children: React.ReactNode;
}
