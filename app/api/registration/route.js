import { NextResponse } from 'next/server';
import admin from '../../../lib/firebaseAdmin';

export async function POST(request) {
    try {
        const body = await request.json();

        console.log('Incoming registration payload:', JSON.stringify(body, null, 2));

        const {
            name,
            email,
            phone,
            paymentId,
            orderId,
            signature,
            kitDelivery,
            gender,
            dob,
            instituteType,
            institute,
            regBace,
            registrationType,
            representative,
            courier,
            remarks,
            agree,
            captcha,
            services,
            totalAmount,
            registrationCharge,
            languageCharge,
            courierCharge,
            deliveryCharge,
            registrationDate,
        } = body;

        const requiredFields = { name, email, phone, paymentId, orderId, signature };
        const missingFields = Object.keys(requiredFields).filter((k) => {
            const v = requiredFields[k];
            return v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
        });

        if (missingFields.length > 0) {
            return NextResponse.json({ success: false, error: 'Missing required fields', missingFields }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(email))) {
            return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 });
        }
        const digits = String(phone).replace(/\D/g, '');
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(digits)) {
            return NextResponse.json({ success: false, error: 'Invalid phone number format. Must be 10 digits.' }, { status: 400 });
        }

        const db = admin.firestore();
        const registrations = db.collection('registrations');

        if (paymentId) {
            const existingSnap = await registrations.where('paymentId', '==', paymentId).limit(1).get();
            if (!existingSnap.empty) {
                const existing = existingSnap.docs[0].data();
                return NextResponse.json({ success: false, error: 'Registration already exists for this payment', registrationId: existing.registrationId }, { status: 409 });
            }
        }

        const registrationId = `REG${Date.now()}${Math.floor(Math.random() * 10000)}`;

        // format registrationDate to human readable like "27 Sept 2025 15:37"
        const dateObj = registrationDate ? new Date(registrationDate) : new Date();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        const hh = String(dateObj.getHours()).padStart(2, '0');
        const mm = String(dateObj.getMinutes()).padStart(2, '0');
        const formattedRegistrationDate = `${dateObj.getDate()} ${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()} ${hh}:${mm}`;

        const registrationData = {
            registrationId,
            name,
            email,
            phone: String(phone).replace(/\D/g, ''),
            kitDelivery: kitDelivery || 'no_kit',
            ...(gender && { gender }),
            ...(dob && { dob }),
            ...(instituteType && { instituteType }),
            ...(institute && { institute }),
            ...(regBace && { regBace }),
            ...(registrationType && { registrationType }),
            ...(registrationType !== 'online' && representative && { representative }),
            ...(courier && Object.keys(courier).length > 0 && { courier }),
            ...(remarks && { remarks }),
            bhagvadGitaEN: languageCharge || 0,
            registrationCharge: registrationCharge || 0,
            courierCharge: courierCharge || 0,
            payment: {
                paymentStatus: 'success',
                transactionId: paymentId || null,
                orderId: orderId || null,
            },
            registrationDate: formattedRegistrationDate,
            totalAmount: totalAmount || 0,
        };

        await registrations.doc(registrationId).set(registrationData);

        console.log('Saved in Firestore successfully:', { registrationId, email, transactionId: paymentId });

        return NextResponse.json(
            {
                success: true,
                message: 'Registration completed successfully!',
                registrationId,
                registration: {
                    id: registrationId,
                    registrationId,
                    name,
                    email,
                    phone: registrationData.phone,
                    totalAmount: registrationData.totalAmount,
                    transactionId: paymentId || null,
                    createdAt: registrationData.registrationDate,
                },
            },
            { status: 201 },
        );
    } catch (error) {
        console.error('Registration API error:', error);
        return NextResponse.json({ success: false, error: 'Registration processing failed', message: error.message || '' }, { status: 500 });
    }
}
