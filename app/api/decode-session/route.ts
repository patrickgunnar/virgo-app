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
    bio: string,
    groups: string[]
}

interface DecodedType {
    userId: string
    iat: number
    exp: number
}

// Constants and configurations
const JWT_SECRET = process.env.JWT_SECRET || ""

// Interfaces remain the same

async function getUserData(sessionValue: string): Promise<UserData | null> {
    try {
        const user = await prisma.user.findFirst({
            where: {
                tokenVirgo: sessionValue,
            },
        })

        if (user) {
            const userGroups = await prisma.groupMembership.findMany({
                where: {
                    userId: user.id,
                },
                select: {
                    groupId: true,
                },
            })

            try {
                const decoded = jwt.verify(sessionValue, JWT_SECRET) as DecodedType

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
                        groups: userGroups.length > 0 ? userGroups.map((id) => id.groupId) : []
                    }

                    return userData
                }
            } catch (jwtError) {
                console.error("JWT decoding error:", jwtError)
            }
        }

        return null
    } catch (error: any) {
        console.error("Error while fetching user data:", error)
        return null
    }
}

export async function POST(request: Request) {
    try {
        const { sessionValue } = await request.json()

        if (sessionValue) {
            const userData = await getUserData(sessionValue)

            if (userData) {
                return NextResponse.json({ data: userData })
            }
        }

        return NextResponse.json({ data: null })
    } catch (error: any) {
        console.error("Request error:", error)
        return new NextResponse("Internal error!", {
            status: 500,
        })
    }
}
