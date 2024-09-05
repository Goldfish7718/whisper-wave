export interface UserType {
    userId: string;
    requests: string[];
    connections: [
        {
            id: string;
            image: string;
            name: string;
        }
    ],
}

export interface SelectedContactType {
    contactId: string;
    fullname: string;
    image: string | undefined;
}

export interface ChatType {
    participant1: string;
    participant2: string;
    chats: [
        {
            sender: string;
            messages: string[];
        }
    ]
}