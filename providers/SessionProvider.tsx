'use client'

import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Cookies from 'js-cookie';
import { UserType } from "@/types";
import { useRouter } from "next/navigation";


const SessionContext = createContext({
    session: null as UserType | null,
    loading: null as boolean | null,
    handleSession: () => {},
    handleLogout: () => {}
})

interface SessionContextProviderProps {
    children: React.ReactNode
}

export const SessionContextProvider: React.FC<SessionContextProviderProps> = ({ children }) => {
    // get router
    const router = useRouter()

    const [session, setSession] = useState<UserType | any>(null)
    const [loading, setIsloading] = useState<boolean | null>(null)

    // user token handler
    const handleUserToken = async () => {
        setIsloading(true)

        // Set the token as an HttpOnly cookie
        const sessionValue = Cookies.get('tokenVirgo')

        if(sessionValue) {
            const { data } = await axios.post('/api/decode-session', { sessionValue })

            setSession(data?.data || null)
        } else {
            setSession(null)
        }

        setIsloading(false)
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

    // set session
    const handleSession = async () => await handleUserToken()

    // context
    const context = useMemo(() => ({
        session: session,
        loading: loading,
        handleSession: handleSession,
        handleLogout: handleLogout
    }), [session])

    return (
        <SessionContext.Provider value={context}>
            {children}
        </SessionContext.Provider>
    )
}

export const useSession = () => useContext(SessionContext)
