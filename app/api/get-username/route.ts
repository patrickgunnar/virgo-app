import { NextResponse } from "next/server";
import prisma from "@/components/libs/prismadb";
import { removeSpecialChar } from "../helpers";


async function checkUsernameExists(username: string): Promise<boolean> {
    if (!username) {
        return false // Empty username, consider it as not existing
    }

    const formattedUsername = removeSpecialChar(username)

    const user = await prisma.user.findUnique({
        where: {
            username: formattedUsername,
        },
    })

    return Boolean(user)
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { usernameData } = body

        if (!usernameData || typeof usernameData !== "string") {
            throw new Error("Invalid username format.")
        }

        const usernameExists = await checkUsernameExists(usernameData)

        return NextResponse.json({
            exists: usernameExists,
        })
    } catch (error: any) {
        console.error("Error in POST request:", error)

        return new NextResponse("Internal error!", {
            status: 500,
        })
    }
}
