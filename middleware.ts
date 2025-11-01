import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // --- Read cookies safely
  const userRole = req.cookies.get("userRole")?.value || "";
  const userId = req.cookies.get("userId")?.value || "";
  const baceNameCookie = req.cookies.get("baceName")?.value || "";

  // --- Extract baseName (slug) if exists: /auth/register/:baceName
  const pathSegments = pathname.split("/").filter(Boolean);
  const baceNameFromURL = pathSegments[2]; // index 2 = slug (for /auth/register/:baceName)

  // --- If new baseName found in URL, set cookie securely
  if (baceNameFromURL && baceNameFromURL !== baceNameCookie) {
    const res = NextResponse.next();
    res.cookies.set("baceName", baceNameFromURL, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
    return res;
  }

  // --- 1️⃣ Public routes: login & register allowed
  if (pathname.startsWith("/login") || pathname.startsWith("/auth/register")) {
    return NextResponse.next();
  }

  // --- 2️⃣ Require authentication
  if (!userRole || !userId) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // --- 3️⃣ Role-based access control
  const isAdmin = userRole === "admin" && userId === "gbtwxYWChJ2QwGnVVlaH";
  const isStudent = userRole === "student";

  // 🔒 Protect /dashboard: admin only
  if (pathname.startsWith("/dashboard")) {
    if (!isAdmin) {
      url.pathname = isStudent ? "/student-home" : "/login";
      return NextResponse.redirect(url);
    }
  }

  // 👨‍🎓 Redirect student trying to access login/dashboard
  if (isStudent && (pathname === "/login" || pathname.startsWith("/dashboard"))) {
    url.pathname = "/student-home";
    return NextResponse.redirect(url);
  }

  // 👨‍💼 Redirect admin trying to access /login
  if (isAdmin && pathname === "/login") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // --- Default: allow request
  return NextResponse.next();
}

// ✅ Routes that should trigger this middleware
export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/student-home",
    "/auth/register/:baceName*",
  ],
};
