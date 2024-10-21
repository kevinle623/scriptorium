import {NextResponse} from "next/server";

export async function GET() {
    console.log("hello world?")
    return NextResponse.json(
        { message: "Hello, world!" },
        { status: 200 }
    );
}