import Cookies from "js-cookie";
import { NextRequest, NextResponse } from "next/server";
import { requestRefreshToken } from "./utils/helper/axios-helper";
import jwt_decode from "jwt-decode";
import { JWTServer } from "./utils/interfaces/server-props";

export function middleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname;
    let accessToken = request.cookies.get('accessToken')?.value
    let refreshToken = request.cookies.get('accessToken')?.value

    if (pathName == "/") {
        return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    if (request.nextUrl.pathname.startsWith('/auth')) {
        let accessToken = request.cookies.get('accessToken')?.value
        if (accessToken) {
            const decoded: JWTServer = jwt_decode(accessToken);
            if (decoded.exp * 1000 > Date.now()) {
                if (decoded.role == "admin") {
                    return NextResponse.redirect(new URL("/admin", request.url))
                } else {
                    return NextResponse.redirect(new URL("/me", request.url))
                }
            }
        } else if (refreshToken) {
            requestRefreshToken(refreshToken)
        } else {
            return NextResponse.redirect(new URL("/auth/login", request.url))
        }
    }
}