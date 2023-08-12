import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "@/components/libs/prismadb";
import { isValidEmail, removeSpecialChar } from "../helpers";


async function createUser(data: {
    name: string;
    email: string;
    password: string;
    username: string;
}): Promise<{ token: string; data: any } | null> {
    try {
        const { name, email, password, username } = data;

        if (!email || !password || !name || !username) {
            throw new Error("Invalid data!");
        }

        const existingUserWithUsername = await prisma.user.findFirst({ where: { username } })
        if(existingUserWithUsername) {
            throw new Error('Username on use!')
        }

        const isEmailValid = isValidEmail(email);
        if (!isEmailValid) {
            throw new Error("Invalid email!");
        }

        const existingUserWithEmail = await prisma.user.findFirst({ where: { email } })
        if (existingUserWithEmail) {
            throw new Error("E-mail on use!");
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        if (!hashedPassword) {
            throw new Error("Something went wrong!");
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                username: removeSpecialChar(username),
                hashedPassword,
                image: "",
                bio: "Welcome to Virgo Chat",
            },
        });

        const secretKey = process.env.JWT_SECRET || "";
        const token = jwt.sign({ ...user }, secretKey, { expiresIn: "1w" });

        return { token, data: user };
    } catch (error: any) {
        console.error("User registration error:", error);
        return null;
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const user = await createUser(body);

        if (!user) {
            return new NextResponse("Internal error!", {
                status: 500,
            });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        console.error("POST request error:", error);
        return new NextResponse("Internal error!", {
            status: 500
        });
    }
}
