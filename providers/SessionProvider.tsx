'use client'

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { UserType } from "@/types";
import { useRouter } from "next/navigation";


const SessionContext = createContext({
    session: null,
    handleSession: (data: UserType | null) => {},
    handleLogout: () => {}
})

interface SessionContextProviderProps {
    children: React.ReactNode
}

export const SessionContextProvider: React.FC<SessionContextProviderProps> = ({ children }) => {
    // get router
    const router = useRouter()

    const [session, setSession] = useState<UserType | any>(null)

    // user token handler
    const handleUserToken = () => {
        // Set the token as an HttpOnly cookie
        const sessionValue = Cookies.get('tokenVirgo')

        if(sessionValue) {
            axios.post('/api/decode-session', { sessionValue }).then((response) => {
                // set data
                setSession(response.data.data)
            })
        } else {
            setSession(null)
        }
    }

    useEffect(() => {
        handleUserToken()
    }, [])

    // set session
    const handleSession = (data: UserType | null) => {
        setSession(data)
    }

    // logout handler
    const handleLogout = () => {
        // remove cookies
        Cookies.remove('tokenVirgo', { expires: 7, path: '/' })
        // set user data
        handleSession(null)
        // refresh page
        router.refresh()
    }

    // context
    const context = {
        session: session,
        handleSession: handleSession,
        handleLogout: handleLogout
    }

    return (
        <SessionContext.Provider value={context}>
            {children}
        </SessionContext.Provider>
    )
}

export const useSession = () => useContext(SessionContext)
