import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Get cookies
  const userRole = req.cookies.get("userRole")?.value;
  const userId = req.cookies.get("userId")?.value;
  const baceNameCookie = req.cookies.get("baceName")?.value;

  // Extract baceName from URL slug if exists
  const pathSegments = url.pathname.split("/").filter(Boolean); // ["auth","register","mayapur"]
  const baceNameFromURL = pathSegments[2]; // index 2 = slug

  // Optional: store baceName in cookie if it exists in URL
  if (baceNameFromURL && baceNameFromURL !== baceNameCookie) {
    const res = NextResponse.next();
    res.cookies.set("baceName", baceNameFromURL, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
    return res;
  }

  // 1️⃣ If no login, restrict access to protected pages
  if (!userRole && !url.pathname.startsWith("/login") && !url.pathname.startsWith("/auth/register")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 2️⃣ Role-based redirects
  if (userRole === "admin") {
    if (url.pathname === "/login" || url.pathname.startsWith("/student-home")) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  if (userRole === "student") {
    if (url.pathname === "/login" || url.pathname.startsWith("/dashboard")) {
      url.pathname = "/student-home";
      return NextResponse.redirect(url);
    }
  }

  // 3️⃣ Allow access to dashboard or student-home based on role
  if (
    (userRole === "admin" && url.pathname === "/dashboard") ||
    (userRole === "student" && url.pathname === "/student-home")
  ) {
    return NextResponse.next();
  }

  // 4️⃣ Allow registration pages to proceed
  if (url.pathname.startsWith("/auth/register")) {
    return NextResponse.next();
  }

  // Default: proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard",
    "/student-home",
    "/auth/register/:baceName*",
    "/api/auth/signin",
  ],
};
