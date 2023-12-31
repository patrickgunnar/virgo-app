'use client'

import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import Cookies from 'js-cookie';
import { ChatType, GroupDataType, GroupType, MessageType, UserType } from "@/types";
import { useRouter } from "next/navigation";
import PusherClient from "pusher-js";
import getChats from "@/components/helpers/getChats";


const SessionContext = createContext({
    session: null as UserType | null,
    chats: [] as ChatType[],
    groups: [] as GroupType[],
    loading: true,
    handleSession: () => { },
    handleLogout: () => { }
})

interface SessionContextProviderProps {
    children: React.ReactNode
}

const useLoadingState = (initialValue: boolean) => {
    const [loading, setLoading] = useState<boolean>(initialValue)

    return {
        loading,
        startLoading: () => setLoading(true),
        stopLoading: () => setLoading(false),
    }
}

export const SessionContextProvider: React.FC<SessionContextProviderProps> = ({ children }) => {
    // get router
    const router = useRouter()

    const [session, setSession] = useState<UserType | null>(null)
    const [messages, setMessages] = useState<MessageType[]>([])
    const [chats, setChats] = useState<ChatType[]>([])
    const [groupsData, setGroupsData] = useState<GroupDataType[]>([])
    const [groups, setGroups] = useState<GroupType[]>([])
    const { loading, startLoading, stopLoading } = useLoadingState(true)

    // pusher ref
    const pusherRef = useRef<any>(null)

    // retrieve groups
    const handleGroupsMessages = async (userId: string) => {
        try {
            if(userId) {
                const groupsMessages = (await axios.post('/api/get-groups/', { userId })).data.data

                setGroups(groupsMessages || [])
            }
        } catch (error) {
            console.error("Error fetching messages:", error)
        }
    }

    // retrieve user's messages
    const handleMessagesData = async (userToken: string) => {
        try {
            if (userToken) {
                const { data } = await axios.post('/api/get-messages/', { token: userToken })

                setMessages(data?.data || null)
            }
        } catch (error) {
            console.error("Error fetching messages:", error)
        }
    }

    // user token handler
    const handleUserToken = async () => {
        // Set the token as an HttpOnly cookie
        const sessionValue = Cookies.get('tokenVirgo')

        if (sessionValue) {
            startLoading()

            try {
                const { data } = await axios.post('/api/decode-session', { sessionValue })

                if (data.data) await handleMessagesData(sessionValue)
                if (data.data) await handleGroupsMessages(data.data.id)

                setSession(data?.data || null)
            } catch (error) {
                console.error("Error decoding session:", error)

                setSession(null)
            }

            stopLoading()
        } else {
            setSession(null)
            stopLoading()
        }
    }

    // logout handler
    const handleLogout = () => {
        // remove cookies
        Cookies.remove('tokenVirgo', { expires: 7, path: '/' })
        // set user data
        setSession(null)
        // refresh page
        router.refresh()
    }

    useEffect(() => {
        handleUserToken()
    }, [])

    useEffect(() => {
        // Function to fetch Pusher configuration
        const fetchPusherConfig = async () => {
            if (session) {
                try {
                    // Fetch Pusher configuration from the API
                    const { pusherKey, pusherCluster } = (await axios.get('/api/config')).data
    
                    // Create a new Pusher instance
                    const pusherInstance = new PusherClient(pusherKey, {
                        cluster: pusherCluster,
                        encrypted: true
                    })
    
                    // Subscribe to the "chat" channel
                    const channel = pusherInstance.subscribe('chat')
    
                    // Listen for the "new-message" event
                    channel.bind('new-message', (data: MessageType) => {
                        // Check if the message involves the current user
                        if (
                            data.receiverId === session.id || 
                            data.senderId === session.id ||
                            session.groups.includes(data.groupId)
                        ) {
                            // Add the new message to the messages state
                            setMessages(prevMessages => [ data, ...prevMessages ])
                        }
                    })

                    // Listen for the "new-group" event
                    channel.bind('new-group', (data: GroupDataType) => {
                        // Check if the group involves the current user
                        if(session.id === data.groupMembers) {
                            // Add the new group to the group state
                            setGroupsData(prevGroups => [data, ...prevGroups])
                        }
                    })
    
                    // Store the Pusher instance in a ref
                    pusherRef.current = pusherInstance;
                } catch (error) {
                    console.error("Error fetching Pusher configuration:", error)
                }
            }
        }
    
        // Fetch Pusher configuration when the component mounts
        if (typeof window !== "undefined") {
            fetchPusherConfig()
        }
    
        // Clean up the Pusher subscription when the component unmounts
        return () => {
            if (pusherRef.current) {
                pusherRef.current.disconnect()
            }
        }
    }, [session])

    useEffect(() => {
        // get chats
        const handleChatFilter = async () => {
            if(session) {
                const chats = await getChats(session.id, messages)

                setChats(chats)
                await handleGroupsMessages(session.id)
            }
        }

        handleChatFilter()
    }, [session, messages, groupsData])

    // set session
    const handleSession = async () => await handleUserToken()

    // context
    const context = useMemo(() => ({
        session: session,
        chats: chats,
        groups: groups,
        loading: loading,
        handleSession: handleSession,
        handleLogout: handleLogout
    }), [session, loading, chats, groups])

    return (
        <SessionContext.Provider value={context}>
            {children}
        </SessionContext.Provider>
    )
}

export const useSession = () => useContext(SessionContext)
