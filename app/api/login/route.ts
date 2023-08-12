import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "@/components/libs/prismadb";
import { isValidEmail } from "../helpers";


export async function POST(request: Request) {
    try {
        // Parse the request body
        const { email, password } = await request.json();

        // Validate email and password
        if (!email || !password || !isValidEmail(email)) {
            throw new Error("Invalid data!");
        }

        // Check if the user with the given email exists
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        // If user doesn't exist or password doesn't match, throw an error
        if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
            throw new Error("Invalid data!");
        }

        // Generate a JWT token with the user's data
        const secretKey = process.env.JWT_SECRET || "";
        const token = jwt.sign({ ...user }, secretKey, { expiresIn: "1w" });

        // Return a JSON response with the token and user data
        return NextResponse.json({
            token,
            data: user,
        });
    } catch (error: any) {
        // Handle errors gracefully
        console.error("Authentication error:", error);
        return new NextResponse("Internal error!", {
            status: 500,
        });
    }
}
