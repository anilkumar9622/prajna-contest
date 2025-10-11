'use client';
import { QuestionBankProps, useQuizContext } from '@/context/QuizContext';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface QuizQuestion {
    question: string;
    options: number[];
}

export default function QuizForm() {
    const { questionBank, submitAnswers } = useQuizContext();
    const router = useRouter();
    const { quizID } = useParams()

    if (!questionBank || questionBank?.questions?.length === 0 || !quizID) {
        return router.push('/dashboard');
    }

    const questionsPerRow = 10;
    const totalSteps = Math.ceil(questionBank.questions.length / questionsPerRow);

    const [currentStep, setCurrentStep] = useState<number>(0);
    const [answers, setAnswers] = useState<QuestionBankProps["answers"]>(questionBank?.answers);

    const handleNextStep = () => {
        submitAnswers(answers, false, quizID, questionBank.id)
        if (currentStep < totalSteps - 1) {
            setCurrentStep(prevStep => prevStep + 1);
        }
    };

    const handleAnswerChange = (questionIndex: number, selectedOption: number) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionIndex]: selectedOption
        }));
    };

    const handleSubmit = async () => {
        submitAnswers(answers, true, quizID, questionBank.id)
        console.log('Submitted Answers:', answers);
    };

    const currentQuestions = questionBank.questions.slice(
        currentStep * questionsPerRow,
        (currentStep + 1) * questionsPerRow
    );

    useEffect(() => {
        console.log(answers)
    }, [answers])

    return (
        <div className="p-8 bg-gray-50 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6 noselect">
                Prajñā 2026 Quiz: Page {currentStep + 1} of {totalSteps}
            </h2>
            <div className="space-y-6">
                {currentQuestions.map((question: QuizQuestion, index) => (
                    <div key={index} className="space-y-4">
                        <p className="text-lg text-gray-700 noselect">{question.question}</p>
                        <div className="grid grid-cols-2 gap-6">
                            {question.options.map((option, optionIndex) => (
                                <label key={optionIndex} className="flex items-center space-x-3 noselect">
                                    <input
                                        type="radio"
                                        name={`question-${currentStep * questionsPerRow + index}`}
                                        value={option}
                                        className="form-radio text-blue-500"
                                        checked={answers[currentStep * questionsPerRow + index] === optionIndex}
                                        onChange={() => handleAnswerChange(currentStep * questionsPerRow + index, optionIndex)}
                                    />
                                    <span className="text-gray-600">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 flex justify-between items-center">
                {currentStep > 0 && (
                    <button
                        onClick={() => setCurrentStep(prevStep => prevStep - 1)}
                        className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow hover:bg-gray-400 noselect"
                    >
                        Previous
                    </button>
                )}
                {currentStep < totalSteps - 1 ? (
                    <button
                        onClick={handleNextStep}
                        className="px-6 py-2 bg-purple-950 text-white font-semibold rounded-lg shadow hover:bg-purple-800 noselect"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 noselect"
                    >
                        Submit
                    </button>
                )}
            </div>
        </div>
    );
}
