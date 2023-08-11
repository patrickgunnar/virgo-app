import ClientOnly from "@/components/table/ClientOnly";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SessionContextProvider } from "@/providers/SessionProvider";


export const metadata = {
    title: "Virgo",
    description: "Your messaging app",
};

// layout
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
	// render content
    return (
        <SessionContextProvider>
            <html lang="en">
                <body className="flex justify-center items-center">
                    <ClientOnly>
                        <Toaster position="top-center" reverseOrder={false} />
                        {children}
                    </ClientOnly>
                </body>
            </html>
        </SessionContextProvider>
    );
}
