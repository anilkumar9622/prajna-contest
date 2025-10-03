import dbFunc from '@/utils/dbFunc';
import { NextRequest, NextResponse } from 'next/server';

async function handler() {
    try {
        const data: any = await dbFunc.findAllDocs('quizes').catch(e => { throw e })
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error checking document:', error);
        return NextResponse.json({ status: false })
    }
}

export { handler as GET }
