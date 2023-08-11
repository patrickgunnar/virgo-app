import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "@/components/libs/prismadb";


export async function POST(request: Request) {
    try {
        // get the body
        const body = await request.json()
        // get user data
        const { email, password, name, username } = body

        // if not expected data
        if(!email || !password || !name || !username) throw new Error('Invalid data!')
        // if not a valid e-mail
        if(!isValidEmail(email)) throw new Error('Invalid data!')

        // crypting user password
        const hashedPassword = await bcrypt.hash(password, 12)

        // if not hashed password
        if(!hashedPassword) throw new Error('Something went wrong!')

        // creating an user
        const user = await prisma.users.create({
            data: {
                name,
                email,
                username,
                hashedPassword,
                image: '',
                groupId: [],
                bio: 'Welcome to Virgo Chat'
            }
        })

        // jwt secret key
        const secretKey = process.env.JWT_SECRET || ''
        // Generate a JWT token with the user's data
        const token = jwt.sign({
            email, password, name, username
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