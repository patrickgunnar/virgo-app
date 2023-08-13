import { NextResponse } from "next/server";
import prisma from "@/components/libs/prismadb";
import jwt from "jsonwebtoken";
import Pusher from "pusher";


interface DecodedType {
    userId: string
    iat: number
    exp: number
}

// Initialize Pusher
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID || "",
    key: process.env.PUSHER_KEY || "",
    secret: process.env.PUSHER_SECRET || "",
    cluster: process.env.PUSHER_CLUSTER || "",
    useTLS: true,
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { token, message, username } = body

        if (
            !token || typeof token !== "string" ||
            !username || typeof username !== "string" ||
            !message || typeof message !== "string"
        ) {
            throw new Error("Invalid token, id or message format.")
        }

        // Ensure the secret key for JWT is provided
        const secretKey = process.env.JWT_SECRET || ""
        // Verify the JWT token and decode its contents
        const decodeToken = jwt.verify(token, secretKey) as DecodedType
        // Check if the token is still valid
        const tokenValid = Date.now() < decodeToken.exp * 1000

        if (tokenValid) {
            // get sender user
            const sender = await prisma.user.findUnique({
                where: {
                    id: decodeToken.userId
                }
            })

            // get receiver user
            const receiver = await prisma.user.findUnique({
                where: {
                    username
                }
            })

            if (sender && sender.tokenVirgo === token && receiver) {
                const newMessage = await prisma.message.create({
                    data: {
                        message: message,
                        senderId: sender.id,
                        receiverId: receiver.id,
                        groupId: sender.id
                    }
                })

                if (newMessage) {
                    pusher.trigger('chat', 'new-message', newMessage)

                    // Return the user data in a JSON response
                    return NextResponse.json({ data: newMessage })
                }
            }
        }

        throw new Error('Something went wrong!')
    } catch (error: any) {
        console.error("Error in POST request:", error)

        return new NextResponse("Internal error!", {
            status: 500,
        })
    }
}
