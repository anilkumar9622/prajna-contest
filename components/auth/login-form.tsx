'use client';
import IconLock from '@/components/icon/icon-lock';
import IconMail from '@/components/icon/icon-mail';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import HookFormInputField from '../hooks/hookFormInput';
import { LoginForm, loginSchema } from '@/utils/schemaValidation';
import Link from 'next/link';
import IconLoader from '@/components/icon/icon-loader';

const ComponentsAuthLoginForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

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

    const onSubmit = async (formData: LoginForm) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.status === 200) {
                showMessage('Login successful!', 'success');
                router.push('/dashboard');
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

    return (
        <>
            <form className="space-y-5 dark:text-white" onSubmit={handleSubmit(onSubmit)}>
                <div className="relative text-white-dark">
                    <HookFormInputField
                        name="email"
                        control={control}
                        placeholder="Enter Email"
                        label="Email"
                        required
                        type="email"
                        error={errors.email?.message}
                        icon={<IconMail fill={true} />}
                    />
                </div>
                <div className="relative text-white-dark">
                    <HookFormInputField
                        name="password"
                        control={control}
                        placeholder="Enter Password"
                        label="Password"
                        required
                        type="password"
                        error={errors.password?.message}
                        icon={<IconLock />}
                    />
                </div>

                <div className="flex items-center justify-between text-sm">
                    <Link href="/auth/forgot-password" className="text-blue-600 hover:underline dark:text-blue-400">
                        Forgot Password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`btn btn-gradient p-3 !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] ${
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

                <div className="text-center mt-4 text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link href="/auth/register" className="text-blue-600 font-bold hover:underline dark:text-blue-400">
                        Register
                    </Link>
                </div>
            </form>
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
