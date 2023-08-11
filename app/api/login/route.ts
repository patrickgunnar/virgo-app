import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "@/components/libs/prismadb";
import { isValidEmail } from "../helpers";


export async function POST(request: Request) {
    try {
        // get the body
        const body = await request.json()
        // get user data
        const { email, password } = body

        // if not expected data
        if(!email || !password) throw new Error('Invalid data!')
        // if not a valid e-mail
        if(!isValidEmail(email)) throw new Error('Invalid data!')

        // check if email exists
        const user = await prisma.users.findUnique({
            where: {
                email
            }
        })

        // if not user
        if(!user) throw new Error('Invalid data!')

        // check if passwords match
        const isMacth = await bcrypt.compare(password, user.hashedPassword)

        // if not same password
        if(!isMacth) throw new Error('Invalid data!')

        // jwt secret key
        const secretKey = process.env.JWT_SECRET || ''
        // Generate a JWT token with the user's data
        const token = jwt.sign({
            ...user
        }, secretKey, { expiresIn: '1w' })

        return NextResponse.json({
            token: token,
            data: user,
        })
    } catch (error: any) {
        return new NextResponse('Internal error!', {
            status: 500
        })
    }
}
