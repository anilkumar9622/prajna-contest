import { NextResponse } from "next/server";
import { db } from "@/utils/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const userQuery = await db.collection("user").where("email", "==", email).limit(1).get();
    if (userQuery.empty) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    if (password !== userData.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const { password: _, ...safeUser } = userData;

    // ✅ Set cookie with token or user info
    const res = NextResponse.json({
      message: "Login successful",
      data: { id: userDoc.id, ...safeUser },
    });

    // Example: store role and userId in cookie (expires in 7 days)
    res.cookies.set("userRole", safeUser.role, { httpOnly: true, path: "/", maxAge: 7 * 24 * 60 * 60 });
    res.cookies.set("userId", userDoc.id, { httpOnly: true, path: "/", maxAge: 7 * 24 * 60 * 60 });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
