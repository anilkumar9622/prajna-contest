import { db } from '@/utils/firebaseAdmin';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, user_id, amount, error } = await request.json();

        const secret = process.env.RAZORPAY_KEY_SECRET || '';

        // Case: Payment failed before signature verification
        if (!razorpay_payment_id || !razorpay_signature) {
            await db.collection("user").doc(user_id).update({
                payment: {
                    status: "failed",
                    amount: amount/100,
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

        if (generated_signature === razorpay_signature) {
            await db.collection("user").doc(user_id).update({
                payment: {
                    status: "success",
                    amount: amount/100,
                    paymentId: razorpay_payment_id,
                    orderId: razorpay_order_id,
                    updatedAt: new Date(),
                },
            });
            return NextResponse.json({ success: true, message: 'Payment verified successfully' });
        } else {
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
    } catch (error: any) {
        return NextResponse.json({ error: 'Verification failed', message: error?.message || '' }, { status: 500 });
    }
}
