import dbFunc from '@/utils/dbFunc';
import { NextRequest, NextResponse } from 'next/server';

async function handler(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const email = url.searchParams.get('session');
        const allowedEmails = process.env.ALLOWED_EMAILS?.split(',') || [];

        if (!email || !allowedEmails.includes(email)) {
            return NextResponse.json({
                status: false,
                message: 'Unauthorized access: Invalid email'
            }, { status: 401 });
        }

        const data = await dbFunc.findAllDocs('users');
        return NextResponse.json({ status: true, data });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({
            status: false,
            message: 'Internal server error'
        }, { status: 500 });
    }
}

export { handler as GET }