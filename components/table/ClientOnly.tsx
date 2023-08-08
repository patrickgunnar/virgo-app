'use client'

import { useEffect, useState } from "react";
import ClientTable from "./ClientTable";


interface ClientOnlyProps {
    children?: React.ReactNode
}

// client only
const ClientOnly: React.FC<ClientOnlyProps> = ({
    children
}) => {
    // use state to deal with on client state
    const [client, setClient] = useState<boolean>(false)

    // deal with the client only state
    // set client to true when on client side
    useEffect(() => setClient(true), [])

    // render elements
    return (
        client ? (
            <ClientTable>
                {children}
            </ClientTable>
        ) : (
            <div>
                Loading...
            </div>
        )
    );
}
 
export default ClientOnly;
