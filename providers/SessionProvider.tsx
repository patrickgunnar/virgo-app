'use client'

import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Cookies from 'js-cookie';
import { MessageType, UserType } from "@/types";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";


const SessionContext = createContext({
    session: null as UserType | null,
    messages: null as MessageType[] | null,
    loading: null as boolean | null,
    handleSession: () => {},
    handleLogout: () => {}
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
    const [messages, setMessages] = useState<MessageType[] | null>(null)
    const { loading, startLoading, stopLoading } = useLoadingState(true)

    // retrieve user's messages
    const handleMessagesData = async (userToken: string) => {
        try {
            if(userToken) {
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

        if(sessionValue) {
            startLoading()
            
            try {
                const { data } = await axios.post('/api/decode-session', { sessionValue })

                if(data.data) await handleMessagesData(sessionValue)

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
        if(session) {
            const pusherKey = process.env.PUSHER_KEY || ""
            const pusherCluster = process.env.PUSHER_CLUSTER || ""

            // Initialize Pusher with your Pusher app key
            const pusher = new Pusher(pusherKey, {
                cluster: pusherCluster
            })

            // Subscribe to the "chat" channel
            const channel = pusher.subscribe('chat')

            // Listen for the "new-message" event
            channel.bind('new-message', (data: MessageType) => {
                if(data.receiverId === session.id || data.senderId === session.id) {
                    // Add the new message to the messages state
                    const prevMessages = messages ? [...messages, data] : [data]

                    setMessages(prevMessages)
                }
            })

            // Clean up the Pusher subscription when the component unmounts
            return () => {
                pusher.unsubscribe('chat')
                pusher.disconnect()
            }
        }
    }, [session])

    // set session
    const handleSession = async () => await handleUserToken()

    // context
    const context = useMemo(() => ({
        session: session,
        messages: messages,
        loading: loading,
        handleSession: handleSession,
        handleLogout: handleLogout
    }), [session, loading])

    return (
        <SessionContext.Provider value={context}>
            {children}
        </SessionContext.Provider>
    )
}

export const useSession = () => useContext(SessionContext)
