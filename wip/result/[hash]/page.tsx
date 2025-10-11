'use client'

import { useQuizContext } from "@/context/QuizContext";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation"
import { useEffect } from "react";
import { Quicksand } from 'next/font/google';
import html2canvas from 'html2canvas';
import { useRouter } from "next/navigation";

const quicksand = Quicksand({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
});

export default function Handler() {
    const session: any = useSession();
    const { hash } = useParams()
    const { fetchResult, result } = useQuizContext();
    const router = useRouter()

    useEffect(() => {
        if (hash)
            fetchResult(hash)
    }, [hash])

    useEffect(() => {
        if (result) {
            handleDownload()
            console.log(result)
        }
    }, [result])

    const handleDownload = async () => {
        try {
            const certificateElement = document.querySelector('.certificate-container') as HTMLDivElement | null;

            if (certificateElement) {
                const canvas = await html2canvas(certificateElement, {
                    scale: 1,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: null,
                    height: certificateElement.scrollHeight,
                    width: certificateElement.scrollWidth,
                });

                canvas.toBlob((blob: Blob | null) => {
                    if (blob) {
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        const safeName = 'PRAJÑĀ 2026'
                        link.download = `${safeName} Participation Certificate.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                    }
                }, 'image/png', 1.0);
            }
        } catch (error) {
            console.error('Error generating certificate:', error);
        } finally {
            setTimeout(() => {
                router.push("/dashboard")
            }, 1000)
        }
    };

    return (
        <div className="flex flex-col items-center p-8 opacity-0">
            <div className="relative certificate-container w-[2000px] max-w-3xl">
                <h1 className={`absolute left-1/2 top-[260px] -translate-x-1/2 -translate-y-1/2 text-4xl sm:text-4xl md:text-4xl lg:text-4xl font-bold text-black z-10 text-center w-full px-4 ${quicksand.className}`}>
                    {result?.name}
                </h1>
                <img
                    src="/certificate.png"
                    alt="Certificate"
                    className="w-full h-auto"
                />
            </div>
        </div>
    )
}