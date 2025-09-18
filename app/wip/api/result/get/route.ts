import dbFunc from '@/utils/dbFunc';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

async function handler(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, quizID } = body;

        const data: any = await dbFunc.findViaDocumentID('users', email).catch(e => { throw e });
        const quiz: any = await dbFunc.findViaDocumentID('quizes', quizID).catch(e => { throw e });

        if (!data?.[quizID]) throw "Result not yet generated!"

        const hash = jwt.sign({ name: data?.fullName, result: data?.[quizID], certificate: quiz?.certificate }, process.env.NEXTAUTH_SECRET || "", { expiresIn: '1h' });

        return NextResponse.json({ hash });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ status: false, error });
    }
}

export { handler as POST };
