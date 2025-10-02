'use client';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import Swal from 'sweetalert2';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

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
    userId: number;
    ref: any;
    autoLoadScript?: boolean;
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({ amount, onPaymentSuccess, onPaymentFailure, customerInfo, className = '', buttonText, disabled = false, userId, ref, autoLoadScript = false }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast', popup: 'small-toast', },
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
            if (!response.ok) {
                throw new Error("Payment verification failed");
            }
            const res = await response.json();
            if (res?.success) {
                router.push("/success");
            }
            return res;
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
    console.log({ userId })
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
                            user_id: userId,
                            amount: orderData.amount,
                            email: orderData?.email
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
     useImperativeHandle(ref, () => ({
      handlePayment,
    }));

    const hasCalled = React.useRef(false);

    useEffect(() => {
        if (amount > 0 && !hasCalled.current) {
            hasCalled.current = true;
            handlePayment();
        }
    }, [amount]);
    return (
        <>
            {autoLoadScript && <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />}
            {/* 
            <button
                type="submit"
                onClick={handlePayment}
                disabled={isLoading || disabled || amount <= 0}
               className="btn btn-gradient p-3 !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Loading...
                    </div>
                ) : (
                    buttonText || `Submit & Pay ₹${amount}`
                )}
            </button> */}
             <style jsx global>
                {`
    /* target title inside toast */
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
`}
            </style>
        </>
    );
};

export default RazorpayPayment;