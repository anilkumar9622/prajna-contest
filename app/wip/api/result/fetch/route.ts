import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

async function handler(req: NextRequest) {
    try {
        const body = await req.json()
        const { hash } = body

        if (!hash) throw "Invalid Hash!"

        const result = jwt.verify(hash, process.env.NEXTAUTH_SECRET || "")

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error processing request:', error)
        return NextResponse.json({ status: false, error })
    }
}

export { handler as POST }
