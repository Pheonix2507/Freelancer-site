import { NextResponse } from "next/server";

export function GET() {
    console.log("Health check request received");
    return NextResponse.json({ status: "ok" }, { status: 200 });
};