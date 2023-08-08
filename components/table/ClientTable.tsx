'use client'

import TopBar from "../navbar/TopBar";
import Navbar from "../navbar/Navbar";

interface ClientTableProps {
    children?: React.ReactNode
}

// client table
const ClientTable: React.FC<ClientTableProps> = ({
    children
}) => {
    // render components
    return (
        <main className="flex flex-col justify-center items-center h-[95%] w-[90%] lg:h-[90%] lg:w-[80%] 
        rounded-md from-[#c77d29] via-[#c66f22] to-[#ae5817] bg-gradient-to-b border-[#c66f22]
        border-[1px] drop-shadow-[0_0_0.5rem] shadow-[#00000092] overflow-hidden">
            <TopBar />
            <div className="flex justify-center items-center h-[90%] md:h-[78%] w-full">
                {children}
            </div>
            <Navbar />
        </main>
    );
}
 
export default ClientTable;
