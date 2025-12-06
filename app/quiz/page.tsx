"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function QuizPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-2xl w-full text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Prajñā Quiz</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Welcome to the quiz! Please read the instructions carefully before starting.
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8 text-left">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Instructions:</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        <li>The quiz consists of multiple-choice questions.</li>
                        <li>You have a limited time to complete the quiz.</li>
                        <li>Once submitted, you cannot change your answers.</li>
                    </ul>
                </div>

                <button 
                    className="btn btn-primary w-full md:w-auto px-8 py-3 text-lg font-semibold rounded-lg transition-transform hover:scale-105"
                    onClick={() => alert("Quiz starting soon!")}
                >
                    Start Quiz
                </button>
            </div>
        </div>
    );
}
