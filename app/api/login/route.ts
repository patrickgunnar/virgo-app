import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "@/components/libs/prismadb";
import { isValidEmail } from "../helpers";


export async function POST(request: Request) {
    try {
        // Parse the request body
        const { email, password } = await request.json()

        // Validate email and password
        if (!email || !password || !isValidEmail(email)) {
            throw new Error("Invalid email or password format.")
        }

        // Check if the user with the given email exists
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        // If user doesn't exist or password doesn't match, throw an error
        if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
            throw new Error("Invalid email or password.")
        }

        // Generate a JWT token with the user's data
        const secretKey = process.env.JWT_SECRET || ""
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1w" })

        const updateData = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                tokenVirgo: token
            }
        })

        // Return a JSON response with the token
        return NextResponse.json({
            token
        })
    } catch (error: any) {
        // Handle errors gracefully
        console.error("Authentication error:", error.message)

        return new NextResponse("Invalid credentials.", {
            status: 401, // Unauthorized status code
        })
    }
}
