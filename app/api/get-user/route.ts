import { NextResponse } from "next/server";
import prisma from "@/components/libs/prismadb";


export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { userId } = body

        if (!userId || typeof userId !== "string") {
            throw new Error("Invalid username format.")
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!user) throw new Error('User not found!')

        return NextResponse.json({
            username: user.username,
            name: user.name,
            image: user.image
        })
    } catch (error: any) {
        console.error("Error in POST request:", error)

        return new NextResponse("Internal error!", {
            status: 500,
        })
    }
}
