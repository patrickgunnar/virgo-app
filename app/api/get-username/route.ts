import { NextResponse } from "next/server";
import prisma from "@/components/libs/prismadb";


export async function POST(request: Request) {
    try {
        // get the body
        const body = await request.json()
        // get user data
        const { usernameData } = body
        // format username
        const username = `${usernameData}`.replaceAll('@', '')

        const user = await prisma.users.findUnique({
            where: {
                username
            }
        })

        return NextResponse.json({
            exists: Boolean(user !== null)
        })
    } catch (error: any) {
        return 
    }
}
