import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export async function POST(request: Request) {
    try {
        // get the body
        const body = await request.json()
        // get user data
        const { sessionValue } = body

        // jwt secret key
        const secretKey = process.env.JWT_SECRET || ''
        // decode the token
        const decodedToken = jwt.verify(sessionValue, secretKey)

        return NextResponse.json({
            data: decodedToken
        })
    } catch (error: any) {
        return new NextResponse('Internal error!', {
            status: 500
        })
    }
}
