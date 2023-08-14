import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "@/components/libs/prismadb";
import { isValidEmail } from "../helpers";


interface DecodedType {
    userId: string
    iat: number
    exp: number
}

const JWT_SECRET = process.env.JWT_SECRET || ""

class AuthenticationError extends Error {
    constructor(message: string) {
        super(message)

        this.name = "AuthenticationError"
    }
}

async function generateToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1w" })
}

async function updateTokenForUser(userId: string, token: string): Promise<void> {
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            tokenVirgo: token
        }
    })
}

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        if (!email || !password || !isValidEmail(email)) {
            throw new AuthenticationError("Invalid email or password format.")
        }

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
            throw new AuthenticationError("Invalid email or password.")
        }

        // Verify the JWT token and decode its contents
        const decoded = jwt.verify(user.tokenVirgo, JWT_SECRET) as DecodedType
        // Check if the token is still valid
        const tokenValid = Date.now() < decoded.exp * 1000

        // check if db token stills valid, return the db token
        // if token not valid, create a new one
        if (tokenValid && decoded.userId === user.id) {
            return NextResponse.json({
                token: user.tokenVirgo
            })
        } else {
            const token = await generateToken(user.id)
            await updateTokenForUser(user.id, token)

            return NextResponse.json({
                token
            })
        }
    } catch (error: any) {
        console.error("Authentication error:", error.message)

        return new NextResponse("Invalid credentials.", {
            status: error instanceof AuthenticationError ? 401 : 500,
        })
    }
}
