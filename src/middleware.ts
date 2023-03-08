import { NextRequest, NextResponse } from "next/server";
import jwt_decode from "jwt-decode";
import { JWTServer } from "./utils/interfaces/server-props";

export function middleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname;
    let accessToken = request.cookies.get('accessToken')?.value

    //index middleware
    if (pathName === "/") {
        return NextResponse.rewrite(new URL("/auth/login", request.url))
    }

    //Auth middleware
    if (request.nextUrl.pathname.startsWith('/auth')) {
        if (accessToken) {
            const decoded: JWTServer = jwt_decode(accessToken);
            if (decoded.role === "admin") {
                return NextResponse.redirect(new URL("/admin", request.url))
            } else if (decoded.role === "user") {
                return NextResponse.redirect(new URL("/me", request.url))
            } else {
                return NextResponse.redirect(new URL("/auth/login", request.url))
            }
        }
    }

    //Protected routes middleware
    if (request.nextUrl.pathname.startsWith("/me") || request.nextUrl.pathname.startsWith("/admin")) {
        if (accessToken) {
            const decoded: JWTServer = jwt_decode(accessToken);
            if (request.nextUrl.pathname.startsWith("/admin") && decoded.role !== "admin") {
                return NextResponse.redirect(new URL("/me", request.url))
            }
            if (request.nextUrl.pathname.startsWith("/me") && decoded.role !== "user") {
                return NextResponse.redirect(new URL("/admin", request.url))
            }
        } else {
            const response = NextResponse.redirect(new URL("/auth/login", request.url))
            response.cookies.delete("accessToken")
            return response
        }
    }
}

export const config = {
    matcher: ["/me/:path*", "/admin/:path*", "/auth/:path*", "/"]
}
