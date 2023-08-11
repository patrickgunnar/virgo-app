'use client'

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { UserType } from "@/types";


const SessionContext = createContext({
    session: null,
    handleSession: (data: UserType | null) => {}
})

interface SessionContextProviderProps {
    children: React.ReactNode
}

export const SessionContextProvider: React.FC<SessionContextProviderProps> = ({ children }) => {
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

    // context
    const context = {
        session: session,
        handleSession: handleSession
    }

    return (
        <SessionContext.Provider value={context}>
            {children}
        </SessionContext.Provider>
    )
}

export const useSession = () => useContext(SessionContext)
