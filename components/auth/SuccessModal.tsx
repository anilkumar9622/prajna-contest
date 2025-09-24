'use client';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type SuccessData = {
    name?: string;
    registrationId?: string;
    paymentId?: string;
    amount?: number;
    kitDelivery?: string;
};

export default function SuccessModal({ data, onClose }: { data: SuccessData; onClose: () => void }) {
    const INITIAL_SECONDS = 10;
    const [seconds, setSeconds] = useState(INITIAL_SECONDS);

    // single timeout-per-tick approach prevents double ticks in dev/StrictMode
    useEffect(() => {
        if (seconds <= 0) {
            onClose();
            return;
        }
        const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
        return () => clearTimeout(t);
    }, [seconds, onClose]);

    const progress = Math.min(100, ((INITIAL_SECONDS - Math.max(0, seconds)) / INITIAL_SECONDS) * 100);

    const handleClose = () => {
        onClose();
    };

    const modal = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black bg-opacity-60" onClick={handleClose} />
            <div className="relative z-50 bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                <div className="px-8 py-6 text-center">
                    <div className="mx-auto w-28 h-28 rounded-full bg-green-500 flex items-center justify-center text-6xl text-white shadow-sm">🥳</div>

                    <h2 className="mt-4 text-2xl font-extrabold text-green-600 tracking-wide">HARI BOL</h2>

                    <p className="text-sm text-gray-600 mt-2">Thank you{data?.name ? `, ${data.name}` : ''}! Your registration is successful.</p>

                    <div className="bg-gray-50 rounded-lg p-4 my-6 space-y-2 text-left">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Registration ID</span>
                            <span className="font-mono text-sm text-blue-600">{data?.registrationId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Payment ID</span>
                            <span className="font-mono text-sm text-green-600">{data?.paymentId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Amount</span>
                            <span className="font-semibold text-sm text-red-600">₹{data?.amount}</span>
                        </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                        <div className="h-2 bg-green-500 transition-all" style={{ width: `${progress}%` }} />
                    </div>

                    <div className="text-sm text-gray-500 mb-4">
                        Auto-closing in <span className="font-bold text-green-600">{Math.max(0, seconds)}</span>s
                    </div>

                    <button onClick={handleClose} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );

    if (typeof document === 'undefined') return null;
    return createPortal(modal, document.body);
}
