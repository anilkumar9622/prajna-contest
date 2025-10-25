'use client';

import React, { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface CaptchaProps {
    onChange: (token: string | null) => void;
    onExpired: () => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onChange, onExpired }) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [isVerified, setIsVerified] = useState(false);
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    // If no site key is provided, don't render the captcha
    if (!siteKey) {
        console.warn('reCAPTCHA site key is missing. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in your environment variables.');
        return (
            <div className="flex flex-col items-center mt-10">
                <p className="text-red-500 text-sm">reCAPTCHA configuration missing</p>
            </div>
        );
    }

    async function handleCaptchaSubmission(token: string | null) {
        try {
            if (token) {
                await fetch('/api/auth/captcha', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });
                setIsVerified(true);
                onChange(token); // ✅ update parent form
            }
        } catch (e) {
            setIsVerified(false);
            onExpired();
        }
    }

    const handleChange = (token: string | null) => {
        handleCaptchaSubmission(token);
    };

    const handleExpired = () => {
        setIsVerified(false);
        onExpired(); // ✅ inform parent
    };

    return (
        <div className="flex flex-col items-center mt-10 sm:scale-100">
            <ReCAPTCHA sitekey={siteKey} ref={recaptchaRef} onChange={handleChange} onExpired={handleExpired} />
            <style jsx global>
                {`
                    .rc-anchor-light.rc-anchor-normal,
                    .rc-anchor-light.rc-anchor-compact {
                        width: 100% !important;
                        padding-right: 20px !important;
                    }
                    .rc-anchor-normal {
                        width: 500px !important;
                        padding-right: 20px !important;
                    }
                    @media (max-width: 640px) {
                        .rc-anchor-normal {
                            width: 100% !important;
                            padding-right: 0px !important;
                        }
                        .rc-anchor-pt {
                            width: 100% !important;
                            padding-right: 12px !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Captcha;
