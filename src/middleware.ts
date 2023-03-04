import { NextRequest, NextResponse } from "next/server";
import jwt_decode from "jwt-decode";
import { JWTServer } from "./utils/interfaces/server-props";

export function middleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname;
    let accessToken = request.cookies.get('accessToken')?.value


    if (pathName === "/") {
        return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    if (!accessToken) {
        const response = NextResponse.redirect(new URL("/auth/login", request.url))
        response.cookies.delete("accessToken")
        return response
    }
}

export const config = {
    matcher: ["/me/:path*", "/admin/:path*", "/"]
}
