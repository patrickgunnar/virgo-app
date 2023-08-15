import { NextResponse } from "next/server";
import prisma from "@/components/libs/prismadb";
import jwt from "jsonwebtoken";
import Pusher from "pusher";


// Define an interface for the decoded JWT payload
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
        const { username, token, groupId } = body

        if (
            !token || typeof token !== "string" || 
            !username || typeof username !== "string" ||
            !groupId || typeof groupId !== "string"
        ) {
            throw new Error("Invalid token or group name format.")
        }

        const secretKey = process.env.JWT_SECRET || ""
        const decodedToken = jwt.verify(token, secretKey) as DecodedType
        const tokenValid = Date.now() < decodedToken.exp * 1000

        if (!tokenValid) {
            throw new Error("Token has expired.")
        }

        const user = await prisma.user.findUnique({
            where: {
                id: decodedToken.userId,
            },
        })

        if (!user || user.tokenVirgo !== token) {
            throw new Error("Invalid user or token mismatch.")
        }

        const newUser = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if (!newUser) {
            throw new Error("Invalid user or token mismatch.")
        }

        const currentGroup = await prisma.group.findUnique({
            where: {
                id: groupId
            },
            select: {
                id: true,
                name: true
            }
        })

        if (!currentGroup) {
            throw new Error("Invalid user or token mismatch.")
        }

        const addingMember = await prisma.groupMembership.create({
            data: {
                groupId: currentGroup.id,
                userId: newUser.id
            },
        })

        console.log("Member added:", addingMember)

        const groupRelation = {
            groupId: currentGroup.id,
            groupName: currentGroup.name,
            groupMembers: addingMember.userId,
            relationId: addingMember.id
        }

        await pusher.trigger("chat", "new-group", groupRelation)

        return NextResponse.json({ data: groupRelation })
    } catch (error: any) {
        console.error("Error in POST request:", error)

        return new NextResponse("Internal error!", {
            status: 500,
        })
    }
}
