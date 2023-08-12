import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import prisma from "@/components/libs/prismadb"
import { isValidEmail, removeSpecialChar } from "../helpers"


async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return bcrypt.hash(password, saltRounds)
}

async function createUser(data: {
    name: string
    email: string
    password: string
    username: string
}): Promise<{ token: string } | null> {
    try {
        const { name, email, password, username } = data

        if (!email || !password || !name || !username) {
            throw new Error("Invalid data!")
        }

        const validUsername = removeSpecialChar(username)

        const existingUserWithUsername = await prisma.user.findFirst({
            where: { username: validUsername },
        })

        if (existingUserWithUsername) {
            throw new Error("Username in use!")
        }

        const isEmailValid = isValidEmail(email)
        if (!isEmailValid) {
            throw new Error("Invalid email!")
        }

        const existingUserWithEmail = await prisma.user.findFirst({ where: { email } })
        if (existingUserWithEmail) {
            throw new Error("Email in use!")
        }

        const hashedPassword = await hashPassword(password)
        if (!hashedPassword) {
            throw new Error("Something went wrong!")
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                username: validUsername,
                hashedPassword,
                image: "",
                bio: "Welcome to Virgo Chat",
                tokenVirgo: "",
            },
        })

        if (!user) {
            throw new Error("Something went wrong!")
        }

        const secretKey = process.env.JWT_SECRET || ""
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1w" })

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                tokenVirgo: token,
            },
        })

        return { token }
    } catch (error: any) {
        console.error("User registration error:", error)
        return null
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const token = await createUser(body)

        if (!token) {
            return new NextResponse("Internal error!", {
                status: 500,
            })
        }

        return NextResponse.json(token)
    } catch (error: any) {
        console.error("POST request error:", error)
        
        return new NextResponse("Internal error!", {
            status: 500,
        })
    }
}
