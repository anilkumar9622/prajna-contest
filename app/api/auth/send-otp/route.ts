import { NextResponse } from "next/server";
import { db } from "@/utils/firebaseAdmin";
import { sendEmail } from "@/lib/nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store OTP in Firestore
    await db.collection("otp_codes").doc(email).set({
      email,
      otp,
      expiresAt,
      createdAt: new Date(),
    });

    // Send OTP via Email
    const emailResult = await sendEmail({
      to: email,
      subject: "Your Login OTP - Prajñā Contest",
      message: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Login Verification</h2>
          <p>Your OTP for logging in is:</p>
          <h1 style="color: #2563eb; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    if (!emailResult.success) {
      throw new Error(emailResult.error);
    }

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
