'use client';
import IconLock from '@/components/icon/icon-lock';
import IconMail from '@/components/icon/icon-mail';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Swal from 'sweetalert2';
import Link from 'next/link';
import IconLoader from '@/components/icon/icon-loader';

const ComponentsAuthLoginForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<'EMAIL' | 'PASSWORD' | 'OTP' | 'SET_PASSWORD'>('EMAIL');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [resetToken, setResetToken] = useState('');

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast', popup: 'small-toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const handleCheckUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            showMessage('Please enter your email', 'error');
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/check-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (res.ok) {
                if (!data.exists) {
                    showMessage('User not found. Redirecting to registration...', 'error');
                    setTimeout(() => router.push('/auth/register'), 2000);
                } else if (data.hasPassword) {
                    setStep('PASSWORD');
                } else {
                    // User exists but has no password -> Skip OTP, go directly to Set Password
                    setStep('SET_PASSWORD');
                }
            } else {
                showMessage(data.error || 'Something went wrong', 'error');
            }
        } catch (error: any) {
            showMessage(error.message || 'Network error', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword) {
            showMessage('Please enter a new password', 'error');
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/set-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword }), // No token sent
            });
            const data = await res.json();

            if (res.ok) {
                showMessage('Password set successfully! Logging in...', 'success');
                // Auto login
                setPassword(newPassword);
                await performLogin(newPassword);
            } else {
                showMessage(data.error || 'Failed to set password', 'error');
            }
        } catch (error: any) {
            showMessage(error.message || 'Network error', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const performLogin = async (pwd: string) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: pwd }),
            });
            const data = await res.json();

            if (res.status === 200) {
                showMessage('Login successful!', 'success');
                router.push('/quiz');
            } else {
                showMessage(data?.message || 'Login failed', 'error');
            }
        } catch (err: any) {
            console.error('❌ Login API failed', err);
            showMessage(err.message || 'Network error, please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await performLogin(password);
    };

    return (
        <>
            <div className="space-y-5 dark:text-white">
                {step === 'EMAIL' && (
                    <form onSubmit={handleCheckUser}>
                        <div className="relative text-white-dark mb-4">
                            <label className="mb-2 block">Email</label>
                            <div className="flex">
                                <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                    <IconMail fill={true} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter Email"
                                    className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`btn btn-gradient p-3 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] ${
                                isLoading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <IconLoader className="animate-spin mr-2" />
                                    Loading...
                                </div>
                            ) : (
                                'Next'
                            )}
                        </button>
                    </form>
                )}

                {step === 'PASSWORD' && (
                    <form onSubmit={handleLoginSubmit}>
                        <div className="relative text-white-dark mb-4">
                            <label className="mb-2 block">Password</label>
                            <div className="flex">
                                <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                    <IconLock />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter Password"
                                    className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm mb-4">
                            <Link href="/auth/forgot-password" className="text-blue-600 hover:underline dark:text-blue-400">
                                Forgot Password?
                            </Link>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`btn btn-gradient p-3 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] ${
                                isLoading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <IconLoader className="animate-spin mr-2" />
                                    Loading...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep('EMAIL')}
                            className="mt-4 text-sm text-gray-600 dark:text-gray-400 hover:underline w-full text-center"
                        >
                            Back to Email
                        </button>
                    </form>
                )}



                {step === 'SET_PASSWORD' && (
                    <form onSubmit={handleSetPassword}>
                        <div className="mb-4">
                            <label className="mb-2 block">Set New Password</label>
                            <div className="flex">
                                <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                    <IconLock />
                                </div>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter New Password"
                                    className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`btn btn-gradient p-3 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] ${
                                isLoading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <IconLoader className="animate-spin mr-2" />
                                    Setting Password...
                                </div>
                            ) : (
                                'Set Password & Login'
                            )}
                        </button>
                    </form>
                )}

                <div className="text-center mt-4 text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link href="/auth/register" className="text-blue-600 font-bold hover:underline dark:text-blue-400">
                        Register
                    </Link>
                </div>
            </div>
            <style jsx global>
                {`
                    .small-toast {
                        padding: 10px 20px !important;
                    }
                    .small-toast .swal2-title {
                        font-size: 16px;
                        line-height: 1.2;
                    }
                    .small-toast .swal2-icon {
                        width: 12px;
                        height: 12px;
                    }
                `}
            </style>
        </>
    );
};

export default ComponentsAuthLoginForm;
