import { NextResponse } from "next/server";
import { db } from "@/utils/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const userQuery = await db.collection("user").where("email", "==", email).limit(1).get();

    if (userQuery.empty) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    // Check if password exists and is not empty
    const hasPassword = !!userData.password && userData.password.length > 0;

    return NextResponse.json({ exists: true, hasPassword }, { status: 200 });
  } catch (error: any) {
    console.error("Check user error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
