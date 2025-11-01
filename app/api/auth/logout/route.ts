import { NextResponse } from "next/server";

export async function GET() {
  // ✅ Default base URL fallback
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://prajna.bace.org.in"
      : "http://localhost:3000");

  // ✅ Redirect safely using absolute URL
  const res = NextResponse.redirect(new URL("/auth/register", baseUrl));

  // ✅ Remove cookies securely
  res.cookies.set("userRole", "", { path: "/", maxAge: 0 });
  res.cookies.set("userId", "", { path: "/", maxAge: 0 });
  res.cookies.set("baceName", "", { path: "/", maxAge: 0 });

  return res;
}
