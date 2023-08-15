'use client'

import { useEffect, useState } from "react";
import ClientTable from "./ClientTable";
import CredentialsTable from "./CredentialsTable";
import { useSession } from "@/providers/SessionProvider";
import Loading from "../loading/Loading";


interface ClientOnlyProps {
    children?: React.ReactNode
}

// client only
const ClientOnly: React.FC<ClientOnlyProps> = ({
    children
}) => {
    // get session
    const { session, loading } = useSession()
    // use state to deal with on client state
    const [client, setClient] = useState<boolean>(false)

    // deal with the client only state
    // set client to true when on client side
    useEffect(() => setClient(true), [])

    // current layout
    const currentLayout = !session ? <CredentialsTable /> : <ClientTable>{children}</ClientTable>

    // render elements
    return (
        client && loading === false ? currentLayout : <Loading />
    );
}
 
export default ClientOnly;
