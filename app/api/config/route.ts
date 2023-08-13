import { NextResponse } from "next/server";


export async function GET() {
    try {
        const config = {
            pusherKey: process.env.PUSHER_KEY,
            pusherCluster: process.env.PUSHER_CLUSTER
          }

        // Return null data in a JSON response
        return NextResponse.json(config)
    } catch (error: any) {
        console.error("Error in POST request:", error)

        return new NextResponse("Internal error!", {
            status: 500,
        })
    }
}
