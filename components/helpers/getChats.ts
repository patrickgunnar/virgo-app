'use client'

import { MessageType, ChatType } from "@/types";
import axios from "axios";


const getChats = async (userId: string | null | undefined, messages: MessageType[]) => {
    const chats: ChatType[] = []
    const usedIds: string[] = []

    if (messages && userId) {
        for(const item of messages) {
            const currentUser = item.senderId === userId ? item.receiverId : item.senderId
            
            if(!usedIds.includes(currentUser)) {
                usedIds.push(currentUser)

                const { name, username, image } = await (await axios.post('/api/get-user/', { userId })).data
                const tempArray = messages.filter(content => (
                    content.receiverId === currentUser ||
                    content.senderId === currentUser
                ))

                chats.push({
                    name,
                    username,
                    image,
                    chat: tempArray
                })
            }
        }
    }

    return chats
}

export default getChats;
