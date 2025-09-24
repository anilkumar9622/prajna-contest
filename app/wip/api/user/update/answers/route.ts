import dbFunc from '@/utils/dbFunc';
import { NextRequest, NextResponse } from 'next/server';

async function handler(req: NextRequest) {
    try {
        const body = await req.json()
        const { answers, email, quizID, questionBankID } = body

        const q: any = await dbFunc.findViaDocumentID('questions', questionBankID).catch(e => { throw e });

        let results = {
            totalQuestions: q.questions.length,
            correctAnswers: 0
        }

        for (let i = 0; i < q.questions.length; i++) {
            if (q.questions[i].answer == answers[i])
                results.correctAnswers += 1
        }

        await dbFunc.updateByDocumentID('users', email, { [quizID]: { answers, results } }).catch(e => { throw e })

        return NextResponse.json({ status: true })
    } catch (error) {
        console.error('Error checking document:', error);
        return NextResponse.json({ status: false })
    }
}

export { handler as POST }
