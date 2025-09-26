'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import './globals.css'

import { QuizProvider } from '@/context/QuizContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <head>
      <meta name="theme-color" content="#13012d" />
      <title>PRAJÑĀ 2025</title>
      </head>
      {/* <body  className='m-auto'> */}
        <SessionProvider>
          <QuizProvider>
            {children}
          </QuizProvider>
        </SessionProvider>
      {/* </body> */}
    </html>
  );
}
