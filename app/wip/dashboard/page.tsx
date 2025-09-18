'use client';

import Quiz from '@/components/Quiz';
import { QuizProps, useQuizContext } from '@/context/QuizContext';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Dashboard() {
    const session: any = useSession();
    const { quizes, loading } = useQuizContext();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await signOut({ callbackUrl: '/' }); // Redirect to home page after logout
        } catch (error) {
            console.error('Logout failed:', error);
            setIsLoggingOut(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray space-y-4">
            <div className='mb-8'>
                <div className='text-center mb-3 noselect'>
                    <h1>Welcome <b>{session?.data?.user?.name}</b>!</h1>
                </div>
                {loading?.quizes && <p>Loading...</p>}
                {!loading?.quizes && quizes?.length === 0 && <p>No quizzes available!</p>}
                {
                    !loading?.quizes && quizes?.length > 0 && quizes?.map((quiz: QuizProps) => (
                        <Quiz key={quiz.id} {...quiz} />
                    ))
                }
            </div>
            <button
                className="noselect px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleLogout}
                disabled={isLoggingOut}
            >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
        </div>
    );
}