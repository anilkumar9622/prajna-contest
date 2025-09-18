'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import SendRequest from '@/utils/SendRequest';
import { useRouter } from 'next/navigation';

export interface QuizProps {
    id: string;
    name: string;
    startDate?: { _seconds?: number };
    endDate?: { _seconds?: number };
    questionBankID: string;
}

interface Question {
    question: string,
    options: []
}

export interface QuestionBankProps {
    id: string,
    answers: Record<string, number>,
    questions: Question[]
}

interface QuizContextProps {
    quizes: QuizProps[] | [];
    result: any;
    loading: any;
    fetchResult: (hash: any) => void;
    downloadResult: (quizID: string) => void;
    submitAnswers: (answers: QuestionBankProps["answers"], finalPage: boolean, quizID: string | string[], questionBankID: string) => void,
    questionBank?: QuestionBankProps;
    quizStatus: string;
    fetchAllQuizes: () => void;
    getTimer: (startDate: QuizProps["startDate"], endDate: QuizProps["endDate"]) => string;
    fetchQuestions: (questionBankID: string, quizID: string) => Promise<void>;
}

const QuizContext = createContext<QuizContextProps | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const router = useRouter()

    const [result, setResult] = useState()

    const [quizes, setQuizes] = useState<QuizProps[] | []>([]);
    const [loading, setLoading] = useState<any>();

    const [questionBank, setQuestions] = useState<QuizContextProps["questionBank"] | undefined>(undefined)
    const [quizStatus, setQuizStatus] = useState<QuizContextProps["quizStatus"]>('')

    const fetchAllQuizes = async () => {
        setLoading({ quizes: true });
        try {
            const res: any = await SendRequest('/quizes/getAll', 'GET').catch(console.error);
            if (res?.data) {
                setQuizes(res.data);
            } else {
                setQuizes([]);
            }
        } catch (error) {
            console.error(error);
            setQuizes([]);
        } finally {
            setLoading({ quizes: false });
        }
    };

    const getTimer = (startDate: QuizProps["startDate"], endDate: QuizProps["endDate"]) => {
        const calculateTimeLeft = (targetTime: number) => {
            const now = Date.now();
            const difference = targetTime - now;
            const days = Math.floor((difference / (1000 * 60 * 60 * 24)));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / (1000 * 60)) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            if (days !== 0) {
                return `${days}d ${hours}h ${minutes}m ${seconds}s`;
            } else {
                return `${hours}h ${minutes}m ${seconds}s`
            }
        };

        const startTime = startDate?._seconds ? new Date(startDate._seconds * 1000).getTime() : null;
        const endTime = endDate?._seconds ? new Date(endDate._seconds * 1000).getTime() : null;

        const now = Date.now();
        let status = '';
        let timeLeft = '';

        if (startTime !== null && now < startTime) {
            status = 'beforeStart';
            timeLeft = calculateTimeLeft(startTime);
        } else if (startTime !== null && now >= startTime && endTime !== null && now < endTime) {
            status = 'afterStart';
            timeLeft = calculateTimeLeft(endTime);
        } else {
            status = 'ended';
            timeLeft = 'Quiz has ended.';
        }

        setQuizStatus(status)
        return timeLeft
    }

    const fetchQuestions = async (questionBankID: string, quizID: string) => {
        setLoading({ questions: true }); // Set loading state
        try {
            const res: any = await SendRequest('/questions/get', 'POST', { questionBankID, quizID });
            if (!res.data.status) throw res.data
            setQuestions(res.data)
            router.push(`/start/quiz/${quizID}`)
        } catch (error: any) {
            alert(error?.error || "Something went wrong!!!")
            console.error('Error fetching questions:', error.message);
        } finally {
            setTimeout(() => {
                setLoading({ questions: false });
            }, 1000)
        }
    };

    useEffect(() => {
        fetchAllQuizes()
    }, [])

    const submitAnswers = async (answers: QuestionBankProps["answers"], finalPage: boolean, quizID: string | string[], questionBankID: string) => {
        setLoading({ answers: true })
        try {
            const res: any = await SendRequest('/user/update/answers', 'POST', { answers, quizID, questionBankID });
            if (res.data) {
                if (finalPage) {
                    alert("Successfully recorded your responses!")
                    router.push('/dashboard')
                }
            }
        } catch (error) {
            alert("Something went wrong!!!")
            console.log(error)
        } finally {
            setLoading({ answers: false })
        }
    }

    const downloadResult = async (quizID: string) => {
        setLoading({ result: true })
        try {
            const res: any = await SendRequest('/result/get/', 'POST', { quizID });

            if (!res.data || !res.data?.hash) throw res.data?.error

            router.push(`/result/${res.data?.hash}`)
        } catch (error: any) {
            alert(error.toString())
        } finally {
            setTimeout(() => {
                setLoading({ result: false })
            }, 1000)
        }
    }

    const fetchResult = async (hash: any) => {
        setLoading({ result: true })
        try {
            const res: any = await SendRequest('/result/fetch/', 'POST', { hash });
            if (!res.data || !res.data?.result) throw res.data?.error
            setResult(res.data)
        } catch (error: any) {
            alert(error)
        } finally {
            setLoading({ result: false })
        }
    }

    return (
        <QuizContext.Provider value={{ result, fetchResult, downloadResult, submitAnswers, quizes, loading, fetchAllQuizes, getTimer, fetchQuestions, quizStatus, questionBank }}>
            {children}
        </QuizContext.Provider>
    );
};

export const useQuizContext = () => {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error('useQuizContext must be used within a QuizProvider');
    }
    return context;
};
