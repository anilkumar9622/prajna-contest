"use client"
import IconChecks from '@/components/icon/icon-checks'
import Link from 'next/link'
import React from 'react'

export default function page() {

  return (
     <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#fafafa]">
            <div className="bg-[#ddd]"  />
            <div className="relative z-50 panel rounded-2xl  max-w-md w-full overflow-hidden">
                <div className="px-8 py-6 text-center">
                    
                   <div className="mx-auto w-28 h-28 rounded-full bg-green-500 flex items-center justify-center text-6xl text-white shadow-sm">
  <span className="animate-check">&#10003;</span>
</div>


                    <h2 className="mt-4 text-xl font-extrabold text-gray-600 tracking-wide">Registration Successful</h2>

                    <p className="text-sm text-gray-600 mt-2">Thank you! for you Registration.</p>

                    <Link href="/">
                    <button  
                    className="btn btn-gradient p-3 !mt-6 w-full border-0 shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                     >
                    Go to Register Page
                    </button>
                    </Link>
                </div>
            </div>
           <style jsx>{`
  @keyframes check-pop {
    0% {
      transform: scale(0) rotate(-30deg);
      opacity: 0;
    }
    60% {
      transform: scale(1.2) rotate(5deg);
      opacity: 1;
    }
    100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }

  @keyframes pulse-bg {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(34,197,94, 0.7);
    }
    50% {
      box-shadow: 0 0 0 20px rgba(34,197,94, 0);
    }
  }

  .animate-check {
    display: inline-block;
    animation: check-pop 0.6s ease-out forwards;
  }

  .animate-pulse-bg {
    animation: pulse-bg 2s infinite;
  }
`}</style>
        </div>
  )
}
