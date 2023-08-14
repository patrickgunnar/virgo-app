import { NextResponse } from "next/server";
import prisma from "@/components/libs/prismadb";
import jwt from "jsonwebtoken";


interface DecodedType {
    userId: string
    iat: number
    exp: number
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { token } = body

        if (!token || typeof token !== "string") {
            throw new Error("Invalid token format.")
        }

        // Ensure the secret key for JWT is provided
        const secretKey = process.env.JWT_SECRET || ""
        // Verify the JWT token and decode its contents
        const decodeToken = jwt.verify(token, secretKey) as DecodedType
        // Check if the token is still valid
        const tokenValid = Date.now() < decodeToken.exp * 1000

        if(tokenValid) {
            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: decodeToken.userId },
                        { receiverId: decodeToken.userId }
                    ]
                },
                orderBy: {
                    created_at: 'desc'
                }
            })

            if(messages) {
                // Return the user data in a JSON response
                return NextResponse.json({ data: messages })
            }
        }

        // Return null data in a JSON response
        return NextResponse.json({ data: null })
    } catch (error: any) {
        console.error("Error in POST request:", error)

        return new NextResponse("Internal error!", {
            status: 500,
        })
    }
}
