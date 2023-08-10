'use client'

import { useEffect, useState } from "react";
import ClientTable from "./ClientTable";
import useSession from "@/hooks/useSession";
import CredentialsTable from "./CredentialsTable";


interface ClientOnlyProps {
    children?: React.ReactNode
}

// client only
const ClientOnly: React.FC<ClientOnlyProps> = ({
    children
}) => {
    // get session
    const { session } = useSession()
    // use state to deal with on client state
    const [client, setClient] = useState<boolean>(false)

    // deal with the client only state
    // set client to true when on client side
    useEffect(() => setClient(true), [])

    // render elements
    return (
        client ? (
            session ? (
                <ClientTable>
                    {children}
                </ClientTable>
            ) : (
                <CredentialsTable />
            )
        ) : (
            <div>
                Loading...
            </div>
        )
    );
}
 
export default ClientOnly;
