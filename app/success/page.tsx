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
                        <span>&#10003;</span>
  
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
        </div>
  )
}
