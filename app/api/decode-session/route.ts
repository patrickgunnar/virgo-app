import { NextResponse } from "next/server";
import prisma from "@/components/libs/prismadb";
import jwt from "jsonwebtoken";


interface UserData {
    id: string
    name: string
    tokenVirgo: string
    email: string
    username: string
    image: string | null
    bio: string
}

interface DecodedType {
    userId: string
    iat: number
    exp: number
}

export async function POST(request: Request) {
    try {
        // Parse the request body
        const { sessionValue } = await request.json()

        if (sessionValue) {
            // Check if a user with the given session token exists
            const user = await prisma.user.findFirst({
                where: {
                    tokenVirgo: sessionValue,
                },
            })

            if (user) {
                // Ensure the secret key for JWT is provided
                const secretKey = process.env.JWT_SECRET || ""

                try {
                    // Verify the JWT token and decode its contents
                    const decoded = jwt.verify(sessionValue, secretKey) as DecodedType

                    // Check if the token is still valid
                    const tokenValid = Date.now() < decoded.exp * 1000

                    if (tokenValid && decoded.userId === user.id) {
                        const userData: UserData = {
                            id: user.id,
                            name: user.name,
                            tokenVirgo: user.tokenVirgo,
                            email: user.email,
                            username: user.username,
                            image: user.image,
                            bio: user.bio,
                        }

                        // Return the user data in a JSON response
                        return NextResponse.json({ data: userData })
                    }
                } catch (jwtError) {
                    console.error("JWT decoding error:", jwtError)
                }
            }
        }

        // Return null data in a JSON response
        return NextResponse.json({ data: null })
    } catch (error: any) {
        // Handle errors gracefully
        console.error("Request error:", error)

        // Return an error response with status code 500
        return new NextResponse("Internal error!", {
            status: 500,
        })
    }
}
