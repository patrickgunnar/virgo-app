import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export async function POST(request: Request) {
    try {
        // Parse the request body
        const { sessionValue } = await request.json();

        // Ensure the secret key for JWT is provided
        const secretKey = process.env.JWT_SECRET || '';

        // Verify the JWT token and decode its contents
        const decodedToken = jwt.verify(sessionValue, secretKey);

        // Return the decoded data in a JSON response
        return NextResponse.json({
            data: decodedToken,
        });
    } catch (error: any) {
        // Handle errors gracefully
        console.error("JWT decoding error:", error);

        // Return an error response with status code 500
        return new NextResponse("Internal error!", {
            status: 500,
        });
    }
}
