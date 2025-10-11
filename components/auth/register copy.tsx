'use client';
import IconMail from '@/components/icon/icon-mail';
import IconUser from '@/components/icon/icon-user';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import React from 'react';
import IconPhoneCall from '../icon/icon-phone-call';
import IconUsers from '../icon/icon-users';
import { baceOptions, instituteOptions } from '@/lib/contant';
import HookFormInputField from '../hooks/hookFormInput';
import HookFormSelectField from '../hooks/hookFormSelect';
import { useForm, SubmitHandler } from 'react-hook-form';
import Captcha from './captcha';
import IconCalendar from '../icon/icon-calendar';
import { formSchema } from '@/utils/schemaValidation';
import Swal from 'sweetalert2';
import RazorpayPayment from './RazorpayPayment';
import SuccessModal from './SuccessModal';
import CourierAddress from './CourierAddress';
import RegistrationSummary from './RegistrationSummary';

const ComponentsAuthRegisterForm = ({ onVerify, verifiedLabel = 'Verified', className = '' }: any) => {
    // Add these new state variables
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(formSchema),
        defaultValues: {
            name: '',
            gender: '',
            dob: '',
            email: '',
            phone: '',
            instituteType: '',
            institute: '',
            regBace: '',
            registrationType: '',

            representative: {
                name: '',
                contact: '',
            },

            isCourier: false,
            courier: {
                houseNo: '',
                line1: '',
                line2: '',
                city: '',
                district: '',
                state: '',
                pincode: '',
                contact: '',
            },

            remarks: '',
            agree: false,
            captcha: '',
        },
    });
    // institute is managed by react-hook-form; no local institute state needed
    const [isOther, setIsOther] = useState(false);

    const handleChange = (value: any) => {
        if (value === 'Other') {
            setIsOther(true);
            // clear form value when switching to free-text input
            reset({ ...watch(), institute: '' });
        } else {
            setIsOther(false);
            setValue('institute', value, { shouldValidate: true });
        }
    };
    const [isCourier, setIsCourier] = useState(false);
    const [courierCharge, setCourierCharge] = useState(0);

    const [registrationType, setRegistrationType] = useState('');
    const [services, setServices] = useState<any>({
        language: false,
        courier: false,
    });

    const handleServiceChange = (key: any) => {
        setServices({ ...services, [key]: !services[key] });
    };

    const [registrationCharge, setRegistrationCharge] = useState<number>(0);
    const instituteTypeHandler = (value: string | number) => {
        if (value === 'school') setRegistrationCharge(200);
        else if (value === 'college') setRegistrationCharge(300);
        else setRegistrationCharge(0);
    };

    const languageCharge = services.language ? 100 : 0;

    useEffect(() => {
        setCourierCharge(registrationType === 'online' && isCourier ? 100 : 0);
    }, [registrationType, isCourier]);

    const total = registrationCharge + languageCharge + courierCharge;

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

    const handlePaymentSuccess = async (paymentData: any) => {
        console.log('Payment successful:', paymentData);
        setIsSubmitting(true);

        try {
            const formData = watch();

            if (isCourier) {
                console.log('Sending courier address to backend:', formData.courier);
            }

            const payload = {
                ...formData,
                ...(isCourier && { courier: formData.courier }),
                totalAmount: total,
                registrationCharge,
                languageCharge,
                courierCharge,
                paymentId: paymentData.razorpay_payment_id,
                orderId: paymentData.razorpay_order_id,
                signature: paymentData.razorpay_signature,
                registrationDate: new Date().toISOString(),
            };

            const response = await fetch('/api/registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                console.log('Registration saved:', result);

                setSuccessData({
                    name: formData.name,
                    registrationId: result.registrationId,
                    paymentId: paymentData.razorpay_payment_id,
                    amount: total,
                });

                setShowSuccessModal(true);
                reset(); // react-hook-form reset
                // reset the visible recaptcha widget so it doesn't show "expired"
                if (typeof window !== 'undefined' && (window as any).grecaptcha) {
                    try {
                        (window as any).grecaptcha.reset();
                    } catch (e) {
                        /* ignore */
                    }
                }
                setIsCourier(false);
            } else {
                showMessage(`Registration failed: ${result.error}`, 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showMessage('Registration failed due to network error.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePaymentFailure = (error: any) => {
        console.log('Payment failed:', error);
        showMessage('Payment failed. Please try again.', 'error');
        setIsSubmitting(false);
    };

    const phoneValue = String(watch('phone') || '');
    const phoneDigits = phoneValue.replace(/\D/g, '');
    const isPhoneValid = /^\d{10}$/.test(phoneDigits);

    const showPhoneFormatError = phoneValue && !isPhoneValid;

    const baseValid = Boolean(
        watch('name') && watch('email') && isPhoneValid && watch('instituteType') && watch('institute') && watch('regBace') && watch('registrationType') && watch('agree') && watch('captcha'),
    );

    // If courier is selected for online registration, ensure courier address fields are present
    const courierHouse = watch('courier.houseNo');
    const courierCity = watch('courier.city');
    const courierState = watch('courier.state');
    const courierPincode = watch('courier.pincode');
    const courierContactValue = String(watch('courier.contact') || '').replace(/\D/g, '');
    const isCourierContactValid = /^\d{10}$/.test(courierContactValue);

    const courierFieldsValid = registrationType === 'online' && isCourier ? Boolean(courierHouse && courierCity && courierState && courierPincode && isCourierContactValid) : true;

    const isFormValid = baseValid && courierFieldsValid;

    return (
        <>
            <form className="space-y-5 dark:text-white">
                <div className="relative text-white-dark">
                    <HookFormInputField name="name" control={control} placeholder="Enter Full Name" label="Full Name" required error={errors.name?.message} icon={<IconUser fill={true} />} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative text-white-dark">
                        <HookFormSelectField
                            name="gender"
                            control={control}
                            label="Gender"
                            placeholder="Select Gender"
                            options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                            ]}
                            required
                            error={errors.gender?.message}
                            icon={<IconUsers />}
                        />
                    </div>
                    <HookFormInputField name="dob" control={control} placeholder="Enter Date of Birth" label="Date of Birth" required type="date" error={errors.dob?.message} icon={<IconCalendar />} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <HookFormInputField name="email" control={control} placeholder="Enter Email" label="Email" required type="email" error={errors.email?.message} icon={<IconMail fill={true} />} />
                    <HookFormInputField
                        name="phone"
                        control={control}
                        type="number"
                        placeholder="Enter Contact"
                        label="Contact no."
                        required
                        error={errors.phone?.message}
                        icon={<IconPhoneCall fill={true} />}
                    />
                    {showPhoneFormatError && <span className="text-red-500 text-sm mt-1">Phone must be 10 digits (numbers only)</span>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2">
                    <HookFormSelectField
                        name="instituteType"
                        control={control}
                        label="Institute Type"
                        callback={instituteTypeHandler}
                        placeholder="Select Institute Type"
                        options={[
                            { value: 'school', label: 'School (Class 9 and above only)' },
                            { value: 'college', label: 'College' },
                        ]}
                        required
                        error={errors.instituteType?.message}
                    />
                </div>

                <div className="flex flex-col ">
                    {!isOther ? (
                        <HookFormSelectField
                            name="institute"
                            control={control}
                            label="Institute Name"
                            placeholder="Select Institute Name"
                            options={[
                                ...instituteOptions.map((inst) => ({
                                    label: inst,
                                    value: inst,
                                })),
                                { label: 'Other', value: 'Other' },
                            ]}
                            required
                            callback={handleChange}
                            error={errors.institute?.message}
                        />
                    ) : (
                        <div className="flex items-start gap-3">
                            <div className="flex-1">
                                <HookFormInputField name="institute" control={control} placeholder="Enter Institute Name" label="Institute Name" required error={errors.institute?.message} />
                            </div>
                            <div className="pt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsOther(false);
                                        setValue('institute', '', { shouldValidate: true });
                                    }}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-full shadow-sm hover:shadow-md hover:bg-blue-50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 11-2 0V6H5v8h10v-1a1 1 0 112 0v2a1 1 0 01-1 1H4a1 1 0 01-1-1V5z" clipRule="evenodd" />
                                        <path d="M7 9a1 1 0 011-1h6a1 1 0 110 2H8a1 1 0 01-1-1z" />
                                    </svg>
                                    <span className="text-sm font-medium">Choose from list</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <HookFormSelectField
                        name="regBace"
                        control={control}
                        label="Registering BACE"
                        placeholder="Select Registering BACE"
                        options={baceOptions.map((bace) => ({
                            label: bace,
                            value: bace,
                        }))}
                        required
                        error={errors.regBace?.message}
                    />
                    <HookFormSelectField
                        name="registrationType"
                        control={control}
                        label="Registration Type"
                        placeholder="-- Select Type --"
                        options={[
                            { value: 'online', label: 'Online' },
                            { value: 'offline', label: 'Offline' },
                        ]}
                        required
                        error={errors.registrationType?.message}
                        callback={(e: any) => setRegistrationType(e)}
                    />
                </div>

                <div className="mt-4">
                    <label className="flex items-center justify-between gap-2 cursor-pointer mb-0 p-1">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={services.language}
                                onChange={() => handleServiceChange('language')}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600"
                            />
                            <div>
                                <div className="text-sm text-gray-800 dark:text-gray-200">Bhagavad Gita (English)</div>
                                <div className="text-xs text-gray-500">Includes printed copy (+ ₹100)</div>
                            </div>
                        </div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-100">+ ₹100</div>
                    </label>
                </div>

                {registrationType === 'online' && (
                    <div className="mt-1 mb-5 space-y-3 border rounded-lg p-2 bg-blue-50 border-blue-600">
                        <label className="flex items-center justify-between gap-2 cursor-pointer mb-0 p-1">
                            <span className="text-sm text-gray-700 dark:text-gray-200">Send Prajna Kit Via Courier</span>
                            <HookFormInputField
                                name="isCourier"
                                control={control}
                                required
                                type="checkbox"
                                callback={(val: any) => setIsCourier(val)}
                                className="form-checkbox h-5 w-5 text-blue-600 border-gray-400"
                            />
                        </label>
                    </div>
                )}

                {registrationType === 'offline' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 border p-4 rounded-lg bg-blue-50 border-blue-600">
                        <HookFormInputField name="representative.name" control={control} label="Representative Name" placeholder="Enter Name" required error={errors.representative?.name?.message} />
                        <HookFormInputField
                            name="representative.contact"
                            control={control}
                            label="Representative Contact"
                            placeholder="Enter Contact"
                            required
                            error={errors.representative?.contact?.message}
                        />
                    </div>
                )}
                {registrationType === 'online' && isCourier && <CourierAddress control={control} errors={errors} />}
                <HookFormInputField name="remarks" control={control} placeholder="Enter remarks" label="Remarks" />
                <RegistrationSummary registrationCharge={registrationCharge} languageCharge={languageCharge} courierCharge={courierCharge} total={total} />

                <div className="mt-4 space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <HookFormInputField name="agree" control={control} required type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 border-gray-400 bg-whit" />
                        <span className="text-sm text-gray-700 dark:text-gray-200">Details must be as per your Institute ID Card otherwise your registration is invalid</span>
                    </label>
                    {errors.agree?.message && <span className="text-red-500 text-sm mt-1">{errors.agree?.message}</span>}
                </div>
                <Captcha onChange={(token: any) => setValue('captcha', token, { shouldValidate: true })} onExpired={() => setValue('captcha', '', { shouldValidate: true })} />

                <div className="hidden">
                    <HookFormInputField name="captcha" control={control} type="hidden" />
                </div>

                {errors.captcha?.message && <span className="text-red-500 text-sm inline lg:block md:block  text-center leading-none">{errors.captcha?.message}</span>}

                <RazorpayPayment
                    amount={total}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentFailure={handlePaymentFailure}
                    customerInfo={{
                        name: watch('name'),
                        email: watch('email'),
                        contact: watch('phone'),
                    }}
                    buttonText={`Pay ₹${total} & Register`}
                    disabled={!isFormValid}
                    className="btn btn-gradient p-3 !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                />
            </form>
            {showSuccessModal && successData && (
                <SuccessModal
                    data={successData}
                    onClose={() => {
                        setShowSuccessModal(false);
                        setSuccessData(null);
                        reset();
                        setIsCourier(false);
                    }}
                />
            )}
        </>
    );
};

export default ComponentsAuthRegisterForm;
