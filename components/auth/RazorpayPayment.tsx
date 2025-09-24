'use client';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Script from 'next/script';

interface RazorpayPaymentProps {
    amount: number;
    onPaymentSuccess?: (paymentData: any) => void;
    onPaymentFailure?: (error: any) => void;
    customerInfo?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    className?: string;
    buttonText?: string;
    disabled?: boolean;
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({ amount, onPaymentSuccess, onPaymentFailure, customerInfo, className = '', buttonText, disabled = false }) => {
    const [isLoading, setIsLoading] = useState(false);

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (document.getElementById('razorpay-script')) return resolve(true);
            const script = document.createElement('script');
            script.id = 'razorpay-script';
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const createOrder = async (orderAmount: number) => {
        try {
            const response = await fetch('/api/payment/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: orderAmount * 100 }),
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Order creation failed');
        }
    };

    const verifyPayment = async (paymentData: any) => {
        try {
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData),
            });

            return await response.json();
        } catch (error) {
            throw new Error('Payment verification failed');
        }
    };

    const formatPhoneNumber = (phone: string) => {
        if (!phone) return '';
        // Remove any non-numeric characters and existing country code
        const cleanPhone = phone.replace(/\D/g, '').replace(/^91/, '');
        // Ensure it's 10 digits and add +91
        if (cleanPhone.length === 10) {
            return `+91${cleanPhone}`;
        }
        return phone;
    };

    const handlePayment = async () => {
        if (amount <= 0) {
            showMessage('Invalid amount!', 'error');
            return;
        }

        setIsLoading(true);

        try {
            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error('Failed to load Razorpay script');
            }

            // Create order
            const orderData = await createOrder(amount);

            // Razorpay options with optimized prefill
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'PRAJÑĀ CONTEST 2026',
                description: 'Registration Payment',
                order_id: orderData.id,
                handler: async function (response: any) {
                    setIsLoading(true);
                    try {
                        // Verify payment
                        const verificationResult = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verificationResult.success) {
                            showMessage('Payment successful!', 'success');
                            onPaymentSuccess?.(response);
                        } else {
                            showMessage('Payment verification failed!', 'error');
                            onPaymentFailure?.(verificationResult);
                        }
                    } catch (error) {
                        showMessage('Payment verification failed!', 'error');
                        onPaymentFailure?.(error);
                    }
                    setIsLoading(false);
                },
                // Pre-fill customer details to minimize form friction
                prefill: {
                    name: customerInfo?.name || '',
                    email: customerInfo?.email || '',
                    contact: formatPhoneNumber(customerInfo?.contact || ''),
                },
                // Make prefilled fields readonly
                readonly: {
                    email: !!customerInfo?.email,
                    contact: !!customerInfo?.contact,
                    name: !!customerInfo?.name,
                },
                theme: {
                    color: '#493f8f',
                },
                modal: {
                    ondismiss: function () {
                        showMessage('Payment cancelled!', 'info');
                        setIsLoading(false);
                    },
                },
                // Configure payment methods
                method: {
                    upi: true,
                    card: true,
                    netbanking: true,
                    wallet: true,
                },
            };

            // @ts-ignore
            const rzp = new window.Razorpay(options);

            rzp.on('payment.failed', function (response: any) {
                showMessage('Payment failed! ' + response.error.description, 'error');
                onPaymentFailure?.(response.error);
                setIsLoading(false);
            });

            rzp.open();
            setIsLoading(false);
        } catch (error) {
            showMessage('Payment initialization failed!', 'error');
            onPaymentFailure?.(error);
            setIsLoading(false);
        }
    };

    return (
        <>
            <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            <button
                type="button"
                onClick={handlePayment}
                disabled={isLoading || disabled || amount <= 0}
                className={`w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${className}`}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Processing...
                    </div>
                ) : (
                    buttonText || `Pay ₹${amount}`
                )}
            </button>
        </>
    );
};

export default RazorpayPayment;
