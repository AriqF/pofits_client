import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname;
    if (pathName == "/") {
        return NextResponse.redirect(new URL("/auth/login", request.url))
    }
    const authToken = request.headers.get("Authorization")
}