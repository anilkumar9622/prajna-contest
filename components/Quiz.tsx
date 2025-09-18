import { QuizProps, useQuizContext } from '@/context/QuizContext';
import { useEffect, useState } from 'react';

export default function Quiz({ id, name, startDate, endDate, questionBankID }: QuizProps) {
    const { getTimer, fetchQuestions, loading, quizStatus, downloadResult } = useQuizContext();
    const [timeLeft, setTimeLeft] = useState<string>();

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeLeft(getTimer(startDate, endDate));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [startDate, endDate]);

    return (
        <div key={id} className="p-4 rounded shadow bg-white">
            <h2 className="text-2xl font-bold text-[#13012d] noselect">{name}</h2>
            {/* <h3 className="text-sm text-gray-500">Question Bank ID: {questionBankID}</h3> */}
            <div className="mt-2">
                {loading?.questions || loading?.result ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-t-4 border-purple-950 rounded-full animate-spin"></div>
                        <p className="text-gray-500">Loading...</p>
                    </div>
                ) : (
                    <>
                        {quizStatus === 'beforeStart' && <p className="text-blue-600 font-medium noselect">Starting in: {timeLeft}</p>}
                        {quizStatus === 'afterStart' && <p className="text-green-600 font-medium nodelect">Quiz ends in: {timeLeft}</p>}
                        {/* {quizStatus === 'ended' && <p className="text-red-600 font-medium">{timeLeft}</p>} */}
                        {quizStatus === 'ended' && <p className="text-red-600 font-medium noselect">{timeLeft} <p className="text-gray-700 font-normal mt-2 noselect">Thank you for your wonderful participation. Round 1 has been concluded. Results have been shared on our WhatsApp group. If you are not part of PRAJÑÀ WhatsApp group, please message on 7982833034.</p></p>}

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-4 mt-4">
                            {quizStatus === 'afterStart' && (
                                <button
                                    className="px-4 py-2 mt-4 bg-purple-950 text-white font-semibold size-full rounded-lg shadow-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-opacity-75"
                                    onClick={() => fetchQuestions(questionBankID, id)}
                                >
                                    Start Quiz
                                </button>
                            )}
                            {quizStatus === 'ended' && (
                                
                                // <p className="text-gray-700 font-medium">Thank you for your wonderful participation. Round 1 has been concluded. Results have been shared on our WhatsApp group. If you are not part of PRAJÑÀ WhatsApp group, please message on 7982833034.</p>
                                <button
                                    className="px-4 py-2 mt-4 bg-blue-500 text-white font-semibold size-full rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 noselect"
                                    onClick={() => downloadResult(id)}
                                >
                                    Download Certificate
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
