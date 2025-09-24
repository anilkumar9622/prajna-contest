'use client';
import React from 'react';

export default function RegistrationSummary({
    registrationCharge = 0,
    languageCharge = 0,
    courierCharge = 0,
    total = 0,
}: {
    registrationCharge?: number;
    languageCharge?: number;
    courierCharge?: number;
    total?: number;
}) {
    return (
        <div className="mt-8 max-w-md mx-auto p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-l-4 border-l-blue-600 rounded-lg panel">
            <div className="mb-6 p-3 bg-green-50 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg text-sm">
                The <span className="font-semibold">Prajna Contest Kit</span> will be provided for your preparation.
                <br />
            </div>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Registration Charge</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">₹{registrationCharge}</span>
                </div>

                {languageCharge > 0 && (
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Bhagavad Gita (English)</span>
                        <span className="font-medium text-gray-800 dark:text-gray-100">+ ₹{languageCharge}</span>
                    </div>
                )}

                {courierCharge > 0 && (
                    <div className="flex justify-between">
                        <div>
                            <span className="text-gray-600 dark:text-gray-300">Courier Charges</span>
                            <p className="text-xs text-gray-500 mt-2">
                                *Delivery Service only for <span className="font-semibold">Delhi & NCR</span>
                            </p>
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-100">+ ₹{courierCharge}</span>
                    </div>
                )}

                <div className="border-t border-gray-300 dark:border-gray-600 my-3"></div>

                <div className="flex justify-between text-base font-bold">
                    <span className="text-gray-900 dark:text-white">Total Amount</span>
                    <span className="text-blue-600 dark:text-blue-400">₹{total}</span>
                </div>
            </div>
        </div>
    );
}
