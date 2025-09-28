import { NextRequest } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request:NextRequest) {
    try {
        const { amount, userId } = await request.json();

        const options = {
            userId: userId,
            amount: amount, // amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return Response.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        return Response.json({ error: 'Failed to create order' }, { status: 500 });
    }
}