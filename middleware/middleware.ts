import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.headers.get("Authorization");

    if (token === null) {
        return NextResponse.redirect(new URL("/login", request.url))
    }
}