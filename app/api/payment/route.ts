import EmailTemplate from '@/lib/emailTemplate/template';
import { sendEmail } from '@/lib/nodemailer';
import { db } from '@/utils/firebaseAdmin';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            user_id,
            amount,
            error,
            email,
            userDetails,
        } = await request.json();

        const secret = process.env.RAZORPAY_KEY_SECRET || '';

        // Case: Payment failed before signature verification
        if (!razorpay_payment_id || !razorpay_signature) {
            await db.collection("user").doc(user_id).update({
                payment: {
                    status: "failed",
                    amount: amount / 100,
                    paymentId: razorpay_payment_id || "",
                    orderId: razorpay_order_id || "",
                    errorMessage: error?.description || "Payment failed",
                    updatedAt: new Date(),
                },
            });
            return NextResponse.json({ success: false, error: "Payment failed" }, { status: 400 });
        }

        // 🔐 Verify signature for success
        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            // Invalid signature = failed payment
            await db.collection("user").doc(user_id).update({
                payment: {
                    status: "failed",
                    paymentId: razorpay_payment_id,
                    orderId: razorpay_order_id,
                    errorMessage: "Invalid signature",
                    updatedAt: new Date(),
                },
            });
            return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
        }

        // ✅ Payment verified successfully
        await db.collection("user").doc(user_id).update({
            payment: {
                status: "success",
                amount: amount / 100,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                updatedAt: new Date(),
            },
        });

        // 🔹 Send email synchronously (await)
        try {
            await sendEmail({
                to: email,
                subject: "Registration Successful: Prajna Contest 2026",
                message: `${EmailTemplate({
                    name: userDetails?.name,
                    amount: amount / 100,
                    transactionId: razorpay_payment_id,
                    supportEmail: "support@bace.org.in",
                    paymentMode: "Online",
                })}`,
            });
            //   console.log("Email sent successfully:", emailResult.messageId);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            return NextResponse.json({ success: false, error: "Payment verified but email failed", details: emailError }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Payment verified and email sent successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Verification failed', message: error?.message || '' }, { status: 500 });
    }
}
