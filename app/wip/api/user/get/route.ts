import dbFunc from '@/utils/dbFunc';
import { NextRequest, NextResponse } from 'next/server';

async function handler(req: NextRequest) {
    try {
        const { emailAddress } = await req.json()
        const data = await dbFunc.findViaDocumentID('users', emailAddress).catch(e => { throw e })
        return NextResponse.json({ status: true, data })
    } catch (error) {
        console.error('Error checking document:', error);
        return NextResponse.json({ status: false })
    }
}

export { handler as POST }
