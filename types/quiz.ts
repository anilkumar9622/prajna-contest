declare module 'app' {
    type QuizProps = {
        startDate: { _seconds: number };
        endDate: { _seconds: number },
        name: string,
        id: string,
        questionBankID: string
    }
}
