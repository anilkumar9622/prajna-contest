import dbFunc from '@/utils/dbFunc';
import { NextRequest, NextResponse } from 'next/server';

async function handler(req: NextRequest) {
    try {
        const body = await req.json();
        const { questionBankID, email, quizID } = body;

        const quiz: any = await dbFunc.findViaDocumentID('quizes', quizID).catch(e => { throw e });

        // Ensure quiz.startDate is a Date object in UTC
        const quizStartDateUTC = new Date(quiz.startDate.toDate().toUTCString());  // Convert Firebase Timestamp to UTC Date

        // Get the current UTC date and time
        const currentDateUTC = new Date();

        // Compare the two UTC dates
        if (currentDateUTC < quizStartDateUTC) throw "Quiz not started yet!";

        const data: any = await dbFunc.findViaDocumentID('questions', questionBankID).catch(e => { throw e });
        const user: any = await dbFunc.findViaDocumentID('users', email).catch(e => { throw e });

        // Exclude answers from questions
        const questions = data?.questions.map(
            (q: any) => ({
                question: q.question,
                options: q.options,
                answer: null  // Exclude answer
            })
        )

        return NextResponse.json({ status: true, id: data.id, questions, answers: user?.[quizID]?.answers || {} });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: false, error });
    }
}

export { handler as POST };
