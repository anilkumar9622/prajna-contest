import dbFunc from '@/utils/dbFunc';
import { generateRandomID } from '@/utils/random';
import { NextResponse } from 'next/server';

async function handler() {
    try {

        const quizID = generateRandomID("QZ");

        const name = "Prajñā Contest"
        const startDate = new Date(Date.UTC(2024, 11, 21, 16, 30)); // Year, Month (0-based), Day, Hour, Minute
        const endDate = new Date(Date.UTC(2024, 11, 21, 17, 40)); // UTC time
        const questionBankID = "QB-1734778296424-i5k2m6";

        await dbFunc.add('quizes', quizID, {
            name,
            questionBankID,
            startDate,
            endDate,
            certificate: ""
        }).catch(e => { throw e });

        return NextResponse.json({ status: true });
    } catch (error: any) {
        console.error('Error checking document:', error);
        return NextResponse.json({ status: false, error: error?.message });
    }
}

export { handler as GET };
