
export interface UserType {
    id: string
    name: string
    email: string
    emailVerified?: Date
    image: string
    groupId: string[]
    username: string
    bio: string
    tokenVirgo: string
}

export interface MessageType {
    id: string
    senderId: string
    receiverId: string
    message: string
    created_at: string
}

