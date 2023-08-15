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

export interface ChatType {
    username: string
    name: string
    image: string
    chat: MessageType[]
}

export interface GroupDataType {
    groupId: string
    groupName: string
    groupMembers: string
    groupMembershipId: string
}

export interface GroupMember {
    name: string
    image: string | null
    username: string
    bio: string
    userId: string
    groupMembershipId: string
}

export interface GroupType {
    messages: MessageType[]
    membersData: GroupMember[]
    groupData: {
        id: string
        name: string
    }
}
