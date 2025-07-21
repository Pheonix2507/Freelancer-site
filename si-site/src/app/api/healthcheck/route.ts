import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
    console.log("Health check request received");
    return NextResponse.json({ status: "ok" }, { status: 200 });
};