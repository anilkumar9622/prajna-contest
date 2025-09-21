import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token: any = await getToken({ req })
    const url = req.nextUrl.clone()

    if (!token && url.pathname !== "/login") {
        url.pathname = "/"
        return NextResponse.redirect(url)
    }

    if (token && token.isNewUser == true && url.pathname == "/dashboard") {
        url.pathname = "/register"
        return NextResponse.redirect(url)
    }

    // if (token && url.pathname === "/login") {
    //     url.pathname = "/dashboard"
    //     return NextResponse.redirect(url)
    // }

    // if (token && token.isNewUser == false && url.pathname === "/register") {
    //     url.pathname = "/dashboard"
    //     return NextResponse.redirect(url)
    // }

    // if (
    //     url.pathname === "/api/auth/signin" &&
    //     url.searchParams.get("error") === "OAuthCallback"
    // ) {
    //     url.pathname = "/dashboard";
    //     return NextResponse.redirect("/login")
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/register", "/api/auth/signin"],
}