import ClientOnly from "@/components/table/ClientOnly";
import "./globals.css";


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
        <html lang="en">
            <body className="flex justify-center items-center">
				<ClientOnly>
					{children}
				</ClientOnly>
			</body>
        </html>
    );
}
