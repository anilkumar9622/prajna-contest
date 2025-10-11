"use client"
import IconChecks from '@/components/icon/icon-checks'
import Link from 'next/link'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function page() {
  const params = useParams();
  const baceName = Array.isArray(params?.baceName) ? params.baceName[0] || '' : typeof params?.baceName === 'string' ? params.baceName : '';
  const [value, setValue] = useState<string>("")
  useEffect(() => {
    if (baceName) {
      localStorage.setItem("regBace", baceName);
      setValue(baceName);
    } else {
      const savedBace = localStorage.getItem("regBace");
      if (savedBace) setValue(savedBace);
    }
  }, [baceName, setValue]);
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#fafafa]">
      <div className="bg-[#ddd]" />
      <div className="relative z-50 rounded-2xl  max-w-md w-full overflow-hidden">
        <div className="px-8 py-6 text-center">
          <div className="mx-auto w-28 h-28 rounded-full bg-green-500 flex items-center justify-center text-6xl text-white shadow-sm animate-pulse-bg">
            <span className="animate-check">&#10003;</span>
          </div>
          <h2 className="mt-4 text-xl font-extrabold text-gray-600 tracking-wide">Registration Successful</h2>
          <p className="text-sm text-gray-600 mt-2">Thank you! for you Registration.</p>
          <Link href={`/auth/register/${value}`}>
            <button
              className="btn btn-gradient p-3 !mt-6 w-full border-0 shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
            >
              Go to Register Page
            </button>
          </Link>
          <p className="text-sm text-gray-600 mt-4">If you have any questions or need assistance contact: +91 9716887036</p>
        </div>
      </div>
      <style jsx>{`
       .small-toast{
        padding: 10px 20px !important;
    }
   .small-toast .swal2-title {
       font-size: 16px; /* smaller text */
       line-height: 1.2; /* optional, adjust spacing */
    }

   .small-toast .swal2-icon {
       width: 12px;   /* optional: smaller icon */
       height: 12px;
    }
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
      .animate-check {
         display: inline-block;
         animation: check-pop 0.6s forwards;
       }

     .animate-pulse-bg {
        animation: pulse-bg 2s infinite;
      }
      @keyframes pulse-bg {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(34, 197, 94, 0);
          }
        }
`}</style>
    </div>
  )
}
