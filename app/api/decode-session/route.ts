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
        // Parse the request body
        const { sessionValue } = await request.json();

        if(sessionValue) {
            const user = await prisma.user.findFirst({ where: { tokenVirgo: sessionValue } })

            if(user && user.tokenVirgo === sessionValue) {
                // Ensure the secret key for JWT is provided
                const secretKey = process.env.JWT_SECRET || ''
                // Verify the JWT token and decode its contents
                const decoded = jwt.verify(sessionValue, secretKey) as unknown as DecodedType
                // check if date is valid
                const tokenDate = Date.now() >= decoded.exp * 1000

                if(!tokenDate && decoded.userId == user.id) return NextResponse.json({ data: {
                    id: user.id,
                    name: user.name,
                    tokenVirgo: user.tokenVirgo,
                    email: user.email,
                    username: user.username,
                    image: user.image,
                    bio: user.bio
                } })
            }
        }

        // Return the decoded data in a JSON response
        return NextResponse.json({ data: null })
    } catch (error: any) {
        // Handle errors gracefully
        console.error("JWT decoding error:", error)

        // Return an error response with status code 500
        return new NextResponse("Internal error!", {
            status: 500,
        })
    }
}
