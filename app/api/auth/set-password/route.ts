import { NextResponse } from "next/server";
import { db } from "@/utils/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Update User Password
    const userQuery = await db.collection("user").where("email", "==", email).limit(1).get();

    if (userQuery.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = userQuery.docs[0];
    
    // NOTE: Storing password as plain text to match existing login implementation.
    // Ideally, this should be hashed using bcrypt.
    await userDoc.ref.update({
      password: newPassword,
      updatedAt: new Date(),
    });

    // Delete used token
    await db.collection("password_reset_tokens").doc(email).delete();

    return NextResponse.json({ message: "Password set successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Set password error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
