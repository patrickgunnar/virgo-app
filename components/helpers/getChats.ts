'use client'

import { MessageType } from "@/types";


const getChats = (userId: string | null | undefined, messages: MessageType[]) => {
    const chats: MessageType[][] = []
    const usedIds: string[] = []

    if (messages && userId) {
        messages.forEach(item => {
            const currentUser = item.senderId === userId ? item.receiverId : item.senderId

            if (!usedIds.includes(currentUser)) {
                const tempArray = messages.filter(content => (
                    content.receiverId === currentUser ||
                    content.senderId === currentUser
                ))

                usedIds.push(currentUser)
                chats.push(tempArray)
            }
        })
    }

    return chats
}

export default getChats;
