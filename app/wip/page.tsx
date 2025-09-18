'use client';
import React, { useEffect } from 'react';

export default function LoginPage(): React.JSX.Element {

  useEffect(() => {
    window.location.replace("https://bace.org.in/prajna2025")
  }, [])

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen space-x-3">
                        <div className="w-5 h-5 border-t-4 border-foreground rounded-full animate-spin"></div>
                        <p className="text-foreground">Please wait...</p>
                    </div>
    </div>
  )
}