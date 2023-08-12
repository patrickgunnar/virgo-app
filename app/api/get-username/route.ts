import { NextResponse } from "next/server";
import prisma from "@/components/libs/prismadb";
import { removeSpecialChar } from "../helpers";


export async function POST(request: Request) {
    try {
        // Parse the request body
        const body = await request.json();
        // Get user data
        const { usernameData } = body;
        // Format username
        const username = removeSpecialChar(usernameData);

        // Check if the username exists
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        // Return a JSON response indicating whether the username exists
        return NextResponse.json({
            exists: Boolean(user !== null),
        });
    } catch (error: any) {
        // Handle errors gracefully
        console.error("Error in POST request:", error);
        return new NextResponse("Internal error!", {
            status: 500,
        });
    }
}
