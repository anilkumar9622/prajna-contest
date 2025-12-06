import { NextResponse } from "next/server";
import { db } from "@/utils/firebaseAdmin";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const otpDoc = await db.collection("otp_codes").doc(email).get();

    if (!otpDoc.exists) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    const otpData = otpDoc.data();

    // Check if OTP matches
    if (otpData?.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Check if OTP is expired
    const now = new Date();
    const expiresAt = otpData?.expiresAt.toDate(); // Convert Firestore Timestamp to Date

    if (now > expiresAt) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // Generate a reset token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store token in Firestore
    await db.collection("password_reset_tokens").doc(email).set({
      email,
      token,
      expiresAt: tokenExpiresAt,
      createdAt: new Date(),
    });

    // Delete used OTP
    await db.collection("otp_codes").doc(email).delete();

    return NextResponse.json({ message: "OTP verified", token }, { status: 200 });
  } catch (error: any) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
