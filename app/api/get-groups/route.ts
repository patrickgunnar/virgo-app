import { NextResponse } from "next/server";
import prisma from "@/components/libs/prismadb";


interface GroupMember {
    name: string
    image: string | null
    username: string
    bio: string
    groupMembershipId: string
}

interface GroupMembership {
    id: string
    groupId: string
}

interface Message { 
    id: string
    senderId: string
    receiverId: string
    message: string
    created_at: Date
    groupId: string
}

interface Group { 
    id: string
    name: string
}

interface GroupResponse {
    messages: Message[]
    groupData: Group | null
    membersData: GroupMember[]
}

async function fetchGroupData(groupMembership: GroupMembership): Promise<GroupResponse> {
    const groupMessages = await prisma.message.findMany({
        where: {
            groupId: groupMembership.groupId,
        },
    })

    const groupData = await prisma.group.findUnique({
        where: {
            id: groupMembership.groupId,
        },
    })

    const groupMembers = await prisma.groupMembership.findMany({
        where: {
            groupId: groupMembership.groupId,
        },
        select: {
            user: {
                select: {
                    name: true,
                    image: true,
                    username: true,
                    bio: true,
                    id: true
                },
            },
        },
    })

    const membersFiltered: GroupMember[] = groupMembers.map(({ user }) => ({
        name: user.name,
        image: user.image || '',
        username: user.username,
        bio: user.bio,
        userId: user.id,
        groupMembershipId: groupMembership.id,
    }))

    const groupResponse: GroupResponse = {
        messages: groupMessages,
        groupData: groupData,
        membersData: membersFiltered,
    }

    return groupResponse
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const body = await request.json()
        const { userId } = body

        if (!userId || typeof userId !== "string") {
            throw new Error("Invalid user id format.")
        }

        const groupMemberships = await prisma.groupMembership.findMany({
            where: {
                userId,
            },
            select: {
                groupId: true,
                id: true,
            },
        })

        const messagesPromises = groupMemberships.map(fetchGroupData)
        const response = await Promise.all(messagesPromises)

        return NextResponse.json({ data: response })
    } catch (error) {
        console.error("Error in POST request:", error)

        return new NextResponse("Internal error!", {
            status: 500,
        })
    }
}
