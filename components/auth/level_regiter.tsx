'use client';
import IconMail from '@/components/icon/icon-mail';
import IconUser from '@/components/icon/icon-user';
import IconLevelSteps from '@/components/icon/IconLevelSteps';
import Globe from '@/components/icon/icon-globe';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';
import IconPhoneCall from '../icon/icon-phone-call';
import { collegeOptions, LevelBaceOptions, LevelOptions, schoolOptions } from '@/lib/contant';
import HookFormInputField from '../hooks/hookFormInput';
import HookFormSelectField from '../hooks/hookFormSelect';
import { useForm } from 'react-hook-form';
import Captcha from './captcha';
import IconCalendar from '../icon/icon-calendar';
import { formSchema, LevelFormSchema } from '@/utils/schemaValidation';
import Swal from 'sweetalert2';
import { startRazorpayPayment } from './RazorPayment';
import { sendEmail } from '@/utils/email';
import EmailTemplate from '@/lib/emailTemplate/template';
import { baceShortcodeMapping } from '@/lib/contant';
import IconMapPin from '../icon/icon-map-pin';

const ComponentsAuthLevelRegisterForm = ({ setLoader }: any) => {
    const [registrationType, setRegistrationType] = useState('');
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(LevelFormSchema),
        defaultValues: {
            fullSpiritualName: '',
            firstName: '',
            lastName: '',
            gender: '',
            dob: '',
            email: '',
            mobile: '',
            whatsapp: '',
            stayLocation: '',
            shippingAddress: '',
            postOffice: '',
            district: '',
            state: '',
            pincode: '',

            counselorName: '',
            languagePreference: '',
            instituteType: '',
            institute: '',
            regBace: '',
            registrationPaymentMode: '',

            volunteer: {
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
            payment: {
                status: 'pending',
                paymentId: '',
                orderId: '',
                updatedAt: new Date(),
                amount: '',
            },
            totalRegistrationAmount: '',
            remarks: '',
            agree: false,
            captcha: '',
        },
    });

    const params = useParams();
    const router = useRouter();
    const [isOther, setIsOther] = useState(false);
    const [isCourier, setIsCourier] = useState(false);
    const [courierCharge, setCourierCharge] = useState(0);
    const [registrationCharge, setRegistrationCharge] = useState<number>(200);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedType, setSelectedType] = useState<'school' | 'college' | ''>('');
    const selectedInstituteType = watch('instituteType', selectedType);
    const [services, setServices] = useState<any>({
        language: false,
        courier: false,
    });

    const baceName = Array.isArray(params?.baceName) ? params.baceName[0] || '' : typeof params?.baceName === 'string' ? params.baceName : '';
    console.log(baceName);

    // Map shortcode to full BACE name
    const getFullBaceName = (shortcode: string): string => {
        if (!shortcode) return '';

        // Remove leading slash if present (e.g., "/ayd" -> "ayd")
        const cleanShortcode = shortcode.startsWith('/') ? shortcode.slice(1) : shortcode;

        // Return mapped full name or original value if not found in mapping
        return baceShortcodeMapping[cleanShortcode] || shortcode;
    };

    const fullBaceName = getFullBaceName(baceName);

    useEffect(() => {
        if (fullBaceName) {
            localStorage.setItem('regBace', fullBaceName);
            setValue('regBace', fullBaceName);
        }
    }, [fullBaceName, setValue]);

    const handleChange = (value: any) => {
        if (value === 'Other') {
            setIsOther(true);
            reset({ ...watch(), institute: '' });
        } else {
            setIsOther(false);
            reset({ ...watch(), institute: value });
        }
    };

    const instituteTypeHandler = (value: any) => {
        setSelectedType(value);
        setIsOther(false);
        reset({ ...watch(), institute: '' });
    };

    const handleServiceChange = (key: any) => {
        setServices({ ...services, [key]: !services[key] });
    };

    const dynamicOptions = selectedInstituteType === 'school' ? schoolOptions : selectedInstituteType === 'college' ? collegeOptions : [];

    const languageCharge = services.language ? 100 : 0;
    useEffect(() => {
        setCourierCharge(isCourier ? 100 : 0);
    }, [isCourier]);

    const total = registrationCharge + languageCharge + courierCharge;
    setValue('totalRegistrationAmount', String(total));

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
    const onSubmit = async (formData: any) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.status === 201 || res.status === 200) {
                if (data?.data && registrationType === 'online') {
                    await startRazorpayPayment({
                        amount: total,
                        userId: data?.data?.id,
                        customerInfo: {
                            name: data?.data?.name,
                            email: data?.data?.email,
                            contact: data?.data?.phone,
                        },
                        onLoader: (res) => {
                            // console.log({ res }, 'loader');
                            setLoader(res);
                        },
                        onSuccess: (paymentData) => {
                            // console.log('✅ Payment success:', paymentData);
                            router.push('/success');
                        },
                        onFailure: (err) => {
                            console.error('❌ Payment failed:', err);
                            showMessage('Payment failed, please try again.', 'error');
                        },
                    });
                }
                if (data?.data && registrationType === 'offline') {
                    await sendEmail({
                        to: data?.data?.email,
                        subject: 'Registraion Successful: Prajñā Contest 2026',
                        message: `${EmailTemplate({
                            name: data?.data?.name,
                            amount: total,
                            transactionId: '',
                            paymentMode: 'Offline',
                            supportEmail: 'support@bace.org.in',
                        })}`,
                    });
                    await showMessage('Registration successfully!', 'success');
                    router.push('/success');
                }
                // console.log({res})
            } else if (res.status === 400) {
                showMessage(data?.message || data?.errors?.join(', ') || 'Validation error', 'error');
            } else {
                showMessage(data?.message || data?.error || 'Something went wrong!', 'error');
            }
        } catch (err: any) {
            // console.log({err})

            console.error('❌ Register API failed', err);
            showMessage(err.message || 'Network error, please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const error = (errors: any) => {
        console.log('Form errors', errors);
        showMessage(errors?.message || 'Form validation failed!', 'error');
    };

    return (
        <>
            <form className="space-y-5 dark:text-white" onSubmit={handleSubmit(onSubmit, error)}>
                <div className="relative text-white-dark">
                    <HookFormInputField
                        name="fullSpiritualName"
                        control={control}
                        placeholder="Enter Full Name"
                        label="Full Spiritual Name, if initiated ( पूरा आध्यात्मिक नाम,  यदि दीक्षा ली हो )"
                        required
                        error={errors.fullSpiritualName?.message}
                        icon={<IconUser fill={true} />}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative text-white-dark">
                        <HookFormInputField
                            name="firstName"
                            control={control}
                            placeholder="Enter First Name"
                            label="First Material Name ( प्रथम भौतिक नाम )"
                            required
                            error={errors.firstName?.message}
                            icon={<IconUser fill={true} />}
                        />
                    </div>
                    <HookFormInputField
                        name="lastName"
                        control={control}
                        placeholder="Enter Last Name"
                        label="Last Material Name ( अंतिम भौतिक नाम )"
                        required
                        error={errors.lastName?.message}
                        icon={<IconUser fill={true} />}
                    />
                </div>

                <div className="relative text-white-dark">
                    <HookFormInputField
                        name="email"
                        control={control}
                        placeholder="Enter Your Email Id"
                        label="Email ID (Please mention your own email ID. We will share the details there.)  ईमेल आईडी (कृपया अपनी स्वयं की ईमेल आईडी लिखें। हम विवरण वहीं साझा करेंगे।)"
                        required
                        error={errors.email?.message}
                        icon={<IconMail fill={true} />}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <HookFormInputField name="dob" control={control} placeholder="Enter Date of Birth" label="Date of Birth ( जन्मतिथि )" required type="date" error={errors.dob?.message} icon={<IconCalendar />} />
                    <div className="relative text-white-dark">
                        <HookFormSelectField
                            name="stayLocation"
                            control={control}
                            placeholder="Enter Your Answer"
                            label="Where do you stay? ( आप कहाँ रहते हैं? )"
                            options={[
                                { value: 'Delhi NCR ( दिल्ली एनसीआर )', label: 'Delhi NCR ( दिल्ली एनसीआर )' },
                                { value: 'Out Of Delhi NCR ( दिल्ली एनसीआर के बाहर )', label: 'Out Of Delhi NCR ( दिल्ली एनसीआर के बाहर )' },
                            ]}
                            required
                            error={errors.stayLocation?.message}
                            icon={<IconMapPin />}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <HookFormInputField
                        name="mobile"
                        control={control}
                        placeholder="Enter Mobile No."
                        label="Mobile No. मोबाइल नंबर (कॉल करने के लिए)"
                        required
                        type="email"
                        error={errors.mobile?.message}
                        icon={<IconPhoneCall fill={true} />}
                    />
                    <HookFormInputField
                        name="whatsapp"
                        control={control}
                        type="number"
                        placeholder="Enter WhatsApp Number"
                        label="WhatsApp Number (व्हाट्सऐप नंबर)"
                        required
                        error={errors.whatsapp?.message}
                        icon={<IconPhoneCall fill={true} />}
                    />
                </div>

                <div className="relative text-white-dark">
                    <HookFormSelectField
                        name="gender"
                        control={control}
                        label="I would like to enroll for ( मैं इसमें नामांकन करना चाहता हूँ )"
                        placeholder="Select Level"
                        options={LevelOptions.map((bace) => ({
                            label: bace.label,
                            value: bace.value,
                        }))}
                        required
                        error={errors.gender?.message}
                        icon={<IconLevelSteps />}
                    />
                </div>

                <div className="relative text-white-dark">
                    <HookFormInputField
                        name="counselorName"
                        type="text"
                        control={control}
                        placeholder="Enter Counselor Name"
                        label="Counselor / Facilitator Name (परामर्शदाता /सलाहकार का नाम) Name of person who is guiding you. ( आपका मार्गदर्शन करने वाले व्यक्ति का नाम )"
                        required
                        error={errors.counselorName?.message}
                        icon={<IconUser fill={true} />}
                    />
                </div>

                <div className="relative text-white-dark">
                    <HookFormSelectField
                        name="language"
                        control={control}
                        placeholder="Choose Language"
                        label="In which language do you want the study material, syllabus, and RA? ( आप अध्ययन सामग्री, पाठ्यक्रम और रीडिंग असाइनमेंट किस भाषा में चाहते हैं? )"
                        options={[
                            { value: 'हिंदी', label: 'हिंदी' },
                            { value: 'English', label: 'English' },
                        ]}
                        required
                        error={errors.languagePreference?.message}
                        icon={<Globe className="w-5" />}
                    />
                </div>

                <div className="relative text-white-dark">
                    <HookFormInputField
                        name="shippingAddress"
                        control={control}
                        placeholder="Enter Full shipping Address"
                        label="Your full shipping address (If incomplete, then delivery will not be possible) ( अपना पूरा डाक/शिपिंग पता लिखें। अधूरा पता होने पर डिलीवरी नहीं हो पाएगी )"
                        icon={<IconMapPin />}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <HookFormInputField
                        name="postOffice"
                        control={control}
                        placeholder="Enter Post office"
                        label="Post office ( पोस्ट ऑफ़िस )"
                        required
                        type="text"
                        error={errors.postOffice?.message}
                        icon={<IconMapPin />}
                    />
                    <HookFormInputField
                        name="district"
                        control={control}
                        type="text"
                        placeholder="Enter District"
                        label="District ( ज़िला )"
                        required
                        error={errors.district?.message}
                        icon={<IconMapPin />}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <HookFormInputField name="state" control={control} placeholder="Enter State" label="State ( राज्य )" required type="text" error={errors.email?.message} icon={<IconMapPin />} />
                    <HookFormInputField
                        name="pincode"
                        control={control}
                        type="number"
                        placeholder="Enter Pin Code"
                        label="Pin Code ( पिन कोड )"
                        required
                        error={errors.pincode?.message}
                        icon={<IconMapPin />}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fullBaceName ? (
                        <HookFormInputField name="regBace" control={control} label="Registering BACE" disabled required error={errors.regBace?.message} />
                    ) : (
                        <HookFormSelectField
                            name="regBace"
                            control={control}
                            label="Registering BACE"
                            placeholder="Select Registering BACE"
                            options={LevelBaceOptions.map((bace) => ({
                                label: bace.label,
                                value: bace.value,
                            }))}
                            required
                            error={errors.regBace?.message}
                        />
                    )}
                    <HookFormSelectField
                        name="registrationPaymentMode"
                        control={control}
                        label="Registration Payment Mode"
                        placeholder="-- Select Payment Mode --"
                        options={[
                            { value: 'online', label: 'Online' },
                            { value: 'offline', label: 'Offline' },
                        ]}
                        required
                        error={errors.registrationPaymentMode?.message}
                        callback={(e: any) => setRegistrationType(e)}
                    />
                </div>
                {registrationType === 'offline' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 border p-4 rounded-lg bg-blue-50 border-blue-600">
                        <HookFormInputField name="volunteer.name" control={control} label="Volunteer Name" placeholder="Enter Volunteer Name" required error={errors.volunteer?.name?.message} />
                        <HookFormInputField
                            name="volunteer.contact"
                            control={control}
                            label="Volunteer Contact"
                            placeholder="Enter Volunteer Contact"
                            required
                            error={errors.volunteer?.contact?.message}
                        />
                    </div>
                )}
                {registrationType === 'online' && (
                    <div className="mt-1 mb-5 space-y-3 border rounded-lg p-2 bg-blue-50 border-blue-600">
                        <label className="flex items-center justify-between gap-2 cursor-pointer mb-0 p-1">
                            <span className="text-sm text-gray-700 dark:text-gray-200">
                                I want to get my Prajñā kit via courier( Courier charge around <span className="font-semibold">Rs 100</span> is extra)
                            </span>
                            <HookFormInputField
                                name="isCourier"
                                control={control}
                                required
                                type="checkbox"
                                callback={(val: any) => setIsCourier(val)}
                                className="form-checkbox h-5 w-5 text-blue-600 border-gray-400 bg-whit"
                            />
                        </label>
                    </div>
                )}
                {registrationType === 'online' && isCourier && (
                    <div className="mt-4 border p-4 rounded-lg space-y-3 bg-blue-50 border-blue-600">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold">Courier Address</h3>
                            <p className="text-xs text-gray-500">
                                ( *This service is only available for <span className="font-semibold">Delhi & NCR </span>)
                            </p>
                        </div>
                        <HookFormInputField name="courier.houseNo" control={control} placeholder="House No., Building Name *" required error={errors.courier?.houseNo?.message} />
                        <HookFormInputField name="courier.line1" control={control} placeholder="Address Line 1" />
                        <HookFormInputField name="courier.line2" control={control} placeholder="Address Line 2" />
                        <div className="grid grid-cols-2 gap-4">
                            <HookFormInputField name="courier.city" control={control} placeholder="City*" required error={errors.courier?.city?.message} />
                            <HookFormInputField name="courier.district" control={control} placeholder="District" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <HookFormInputField name="courier.state" control={control} placeholder="State*" required error={errors.courier?.state?.message} />
                            <HookFormInputField name="courier.pincode" control={control} placeholder="Pincode*" required error={errors.courier?.pincode?.message} />
                        </div>
                        <HookFormInputField name="courier.contact" control={control} placeholder="Contact Number*" required error={errors.courier?.contact?.message} />
                    </div>
                )}
                <HookFormInputField
                    name="remarks"
                    control={control}
                    placeholder="Enter remarks"
                    label="Feedback / Comment I  प्रतिक्रिया / टिप्पणी
Please give your feedback, suggestions, or mention any challenges that you faced, and let us know how Education CSU can improve to serve you better. ( कृपया अपनी प्रतिक्रिया, सुझाव दें या कोई भी कठिनाई बताएं जो आपने अनुभव की हो। साथ ही यह भी बताएं कि एजुकेशन CSU किस प्रकार सुधार कर आपकी बेहतर सेवा कर सकता है। )"
                />
                <div
                    className="mt-8 max-w-md mx-auto  px-4 lg:p-6
                       bg-white dark:bg-gray-800 
                       border border-gray-200 dark:border-gray-700 
                       border-l-4 border-l-blue-600 
                        rounded-lg panel"
                >
                    <div className="mb-6 p-3 bg-green-50 dark:bg-green-900 border border-green-900 dark:border-green-700 rounded-lg text-sm">
                        The <span className="font-bold">Prajñā Contest Kit</span>
                        (Bhagavad Gita As it Is <span className="font-bold">Hindi</span>, bilingual Brochure cum Question Bank) will be provided for your preparation.
                        <br />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">You may also opt language preference</span>
                    <div className="mt-1 mb-5 space-y-3 border rounded-lg p-2 bg-[#fff9ed] border-red-900">
                        <label className="flex items-center justify-between gap-2 cursor-pointer mb-0 p-1">
                            <span className="text-sm text-gray-700 dark:text-gray-200">English Bhagavad Gita (+ ₹100)</span>
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-blue-600 border-gray-400 bg-white"
                                checked={services.language}
                                onChange={() => handleServiceChange('language')}
                            />
                        </label>
                    </div>
                    <div className="border-b border-l-2 mb-2"></div>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Registration Charge</span>
                            <span className="font-medium text-gray-800 dark:text-gray-100">₹{registrationCharge}</span>
                        </div>
                        {services.language && (
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">
                                    Bhagavad Gita (English) <span className="text-xs text-gray-500"></span>
                                </span>
                                <span className="font-medium text-gray-800 dark:text-gray-100">+ ₹100</span>
                            </div>
                        )}
                        {courierCharge > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">
                                    <p>Courier Charges</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        *Delivery Service only for <span className="font-semibold">Delhi & NCR</span>
                                    </p>
                                </span>
                                <span className="font-medium text-gray-800 dark:text-gray-100">+ ₹100</span>
                            </div>
                        )}
                        <div className="border-t border-gray-300 dark:border-gray-600 my-3"></div>
                        <HookFormInputField name="totalRegistrationAmount" control={control} type="hidden" defaultValue={total} />
                        <div className="flex justify-between text-base font-bold">
                            <span className="text-gray-900 dark:text-white">Total Amount</span>
                            <span className="text-blue-600 dark:text-blue-400">₹{total}</span>
                        </div>
                    </div>
                </div>
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
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`btn btn-gradient p-3 !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                            Loading...
                        </div>
                    ) : registrationType !== 'online' ? (
                        'Register'
                    ) : (
                        'Register & Pay'
                    )}
                </button>
            </form>
            <style jsx global>
                {`
                    /* target title inside toast */
                    .small-toast {
                        padding: 10px 20px !important;
                    }
                    .small-toast .swal2-title {
                        font-size: 16px; /* smaller text */
                        line-height: 1.2; /* optional, adjust spacing */
                    }

                    .small-toast .swal2-icon {
                        width: 12px; /* optional: smaller icon */
                        height: 12px;
                    }
                `}
            </style>
        </>
    );
};

export default ComponentsAuthLevelRegisterForm;
