'use client'

import { UserType } from "@/types"
import { useEffect, useState } from "react"


interface SessionStore {
    user: UserType
    token: string
}

// use session hook
const useSession = () => {
    const [session, setSession] = useState<SessionStore | null>(null)

    useEffect(() => {
        // check for an existing session
        const existingSession = localStorage.getItem('session-virgo')

        // if session set session, else set null
        if(existingSession) setSession(JSON.parse(existingSession))
        else setSession(null)
    }, [])

    // create session on login handler
    const handleLoginSession = ({ user, token }: SessionStore) => {
        const sessionData: SessionStore = { user, token }

        // add data
        localStorage.setItem('session-virgo', JSON.stringify(sessionData))
        setSession(sessionData)
    }

    // delete session on logout handler
    const handleLogoutSession = () => {
        // remove data
        localStorage.removeItem('session-virgo')
        setSession(null)
    }

    return {
        session, handleLoginSession, handleLogoutSession
    }
}

export default useSession
