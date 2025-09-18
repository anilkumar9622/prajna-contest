'use client';
import IconMail from '@/components/icon/icon-mail';
import IconUser from '@/components/icon/icon-user';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import IconPhoneCall from '../icon/icon-phone-call';
import IconUsers from '../icon/icon-users';
import { baceOptions, instituteOptions } from '@/lib/contant';
import HookFormInputField from '../hooks/hookFormInput';
import HookFormSelectField from '../hooks/hookFormSelect';
import { useForm, SubmitHandler } from 'react-hook-form';
import Captcha from './captcha';
import IconCalendar from '../icon/icon-calendar';
import { formSchema } from '@/utils/schemaValidation';
// import handler from '@/app/api/auth/register/route';
type FormValues = {
    name: string;
    gender: string;
    dob: string;                // changed from Date to string
    email: string;
    phone: string;
    instituteType: string;
    institute: string;
    regBace: string;
    registrationType: string;
    collectorName: string;      // ensure string, not string | undefined
    collectorContact: string;   // ensure string, not string | undefined
    courierHouseNo: string;
    courierLine1: string;
    courierLine2: string;
    courierCity: string;
    courierDistrict: string;
    courierState: string;
    courierPincode: string;
    courierContact: string;
    remarks: string;
    agree: boolean;               // 👈 schema enforces only true
};

const ComponentsAuthRegisterForm = ({ onVerify, verifiedLabel = "Verified", className = "", }: any) => {
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        // formState: { isSubmitting, isValid },   
        formState: { errors },
    } = useForm({
        resolver: yupResolver(formSchema),
        defaultValues: {
            name: "",
            gender: "",
            dob: "", // 👈 changed from new Date() to empty string
            email: "",
            phone: "",
            instituteType: "",
            institute: "",
            regBace: "",
            registrationType: "",
            collectorName: "",
            collectorContact: "",
            courierHouseNo: "",
            courierLine1: "",
            courierLine2: "",
            courierCity: "",
            courierDistrict: "",
            courierState: "",
            courierPincode: "",
            courierContact: "",
            remarks: "",
            agree: false,
            captcha: "",  // 👈 added to match schema
        },
    });
    const [checked, setChecked] = useState(false);

    const toggle = () => {
        const next = !checked;
        setChecked(next);
        onVerify?.(next);
    };
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const [date1, setDate1] = useState<any>('');
    const router = useRouter();

    const submitForm = (e: any) => {
        e.preventDefault();
        router.push('/');
    };
    const [institute, setInstitute] = useState("");
    const [isOther, setIsOther] = useState(false);

    const handleChange = (value: any) => {
        if (value === "Other") {
            setIsOther(true);
            setInstitute(""); // reset input
            reset({ ...watch(), institute: "" }); // reset form value
        } else {
            setIsOther(false);
            setInstitute(value);
        }
    };
    const [isCourier, setIsCourier] = useState(false);
    console.log("isCourier", isCourier);
    const [courierCharge, setCourierCharge] = useState(0);

    const [registrationType, setRegistrationType] = useState("");
    const [offlineCollector, setOfflineCollector] = useState({ name: "", contact: "" });
    const [courier, setCourier] = useState({
        houseNo: "",
        building: "",
        line1: "",
        line2: "",
        city: "",
        district: "",
        state: "",
        pincode: "",
        contact: ""
    });
    const [services, setServices] = useState<any>({
        language: false,
        courier: false,
    });

    const handleServiceChange = (key: any) => {
        setServices({ ...services, [key]: !services[key] });
    };
    const registrationCharge = 300; // example base fee
    const languageCharge = services.language ? 100 : 0;


    useEffect(() => {
        setCourierCharge(registrationType === "online" ? 100 : 0);
    }, [registrationType]);

    const total = registrationCharge + languageCharge + courierCharge;
    console.log("courierCharge", registrationType, courierCharge);
    const [gender, setGender] = useState("");
    const [instituteType, setInstituteType] = useState("");

    const [regBace, setRegBace] = useState("");


    //   const registrationType = watch("registrationType");

    const onSubmit: any = async (data: any) => {
        // await handler(
        //     {
        //         body: { name: "anil", gender: "male", dob: "2000-01-01" },
        //         method: "POST",
        //     } as any,
        //     {
        //         status: (code: number) => ({
        //             json: (obj: any) => {
        //                 console.log("Response:", code, obj);
        //                 return obj;
        //             },
        //         }),
        //     } as any
        // );

        console.log("Form Data:", data);
    };
  const handleRegister = async (formData: any) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json();
  console.log(data);
};

    return (
        <>
            <form className="space-y-5 dark:text-white" onSubmit={handleSubmit(onSubmit)}>
                <div className="relative text-white-dark">
                    <HookFormInputField
                        name="name"
                        control={control}
                        placeholder="Enter Full Name"
                        label="Full Name"
                        required
                        error={errors.name?.message}
                        icon={<IconUser fill={true} />} // 👈 Pass icon
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative text-white-dark">
                        <HookFormSelectField
                            name="gender"
                            control={control}
                            label="Gender"
                            placeholder="Select Gender"
                            options={[
                                { value: "male", label: "Male" },
                                { value: "female", label: "Female" },
                            ]}
                            required
                            error={errors.gender?.message}
                            icon={<IconUsers />}
                        />
                    </div>
                    <HookFormInputField
                        name="dob"
                        control={control}
                        placeholder="Enter Date of Birth"
                        label="Date of Birth"
                        required
                        type="date"
                        error={errors.dob?.message}
                        icon={<IconCalendar />}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <HookFormInputField
                        name="email"
                        control={control}
                        placeholder="Enter Email"
                        label="Email"
                        required
                        type="email"
                        error={errors.email?.message}
                        icon={<IconMail fill={true} />} // 👈 Pass icon
                    />
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
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2">
                    <HookFormSelectField
                        name="instituteType"
                        control={control}
                        label="Institute Type"
                        placeholder="Select Institute Type"
                        options={[
                            { value: "school", label: "School (Class 9 and above only)" },
                            { value: "college", label: "College" },
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
                                { label: "Other", value: "Other" },
                            ]}
                            required
                            callback={handleChange}
                            error={errors.institute?.message}
                        />
                    ) : (
                        <HookFormInputField
                            name="institute"
                            control={control}
                            placeholder="Enter Institute Name"
                            label="Institute Name"
                            required
                            error={errors.institute?.message}
                        />
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
                        placeholder='-- Select Type --'
                        options={[
                            { value: "online", label: "Online" },
                            { value: "offline", label: "Offline" },
                        ]}
                        required
                        error={errors.registrationType?.message}
                        callback={(e: any) => setRegistrationType(e)}
                    />
                </div>

                {registrationType === "offline" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 border p-4 rounded-lg bg-blue-50 border-blue-600">
                        <HookFormInputField
                            name="collectorName"
                            control={control}
                            label="Name"
                            placeholder="Enter Name"
                            required
                            error={errors.collectorName?.message}
                        />
                        <HookFormInputField
                            name="collectorContact"
                            control={control}
                            label="Contact"
                            placeholder="Enter Contact"
                            required
                            error={errors.collectorContact?.message}

                        />
                    </div>
                )}
                {registrationType === "online" && (
                    <div className="mt-1 mb-5 space-y-3 border rounded-lg p-2 bg-blue-50 border-blue-600">
                        <label className="flex items-center justify-between gap-2 cursor-pointer mb-0 p-1">
                            <span className="text-sm text-gray-700 dark:text-gray-200">
                                Send Prajna Kit Via Courier
                            </span>
                            {/* <input
                                type="checkbox"
                                className="form-checkbox border-gray-400 bg-white h-5 w-5 text-blue-600"
                                checked={isCourier}
                                onChange={() => setIsCourier(!isCourier)}
                            /> */}
                            <HookFormInputField
                                name="isCourier"
                                control={control}
                                required
                                type="checkbox"
                                callback={(val: any) => setIsCourier(val)}
                                className="form-checkbox h-5 w-5 text-blue-600 border-gray-400 bg-whit"
                            />

                        </label>
                    </div>)}

                {registrationType === "online" && isCourier && (
                    <div className="mt-4 border p-4 rounded-lg space-y-3 bg-blue-50 border-blue-600">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold">Courier Address</h3>
                            <p className="text-xs text-gray-500">
                                ( *This service is only available for <span className="font-semibold">Delhi & NCR </span>)
                            </p>
                        </div>

                        <HookFormInputField
                            name="courierHouseNo"
                            control={control}
                            placeholder="House No., Building Name *"
                            required
                            error={errors.courierHouseNo?.message}

                        />
                        <HookFormInputField
                            name="courierLine1"
                            control={control}
                            placeholder="Address Line 1"
                        />
                        <HookFormInputField
                            name="courierLine2"
                            control={control}
                            placeholder="Address Line 2"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <HookFormInputField
                                name="courierCity"
                                control={control}
                                placeholder="City*"
                                required
                                error={errors.courierCity?.message}

                            />
                            <HookFormInputField
                                name="courierDistrict"
                                control={control}
                                placeholder="District"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <HookFormInputField
                                name="courierState"
                                control={control}
                                placeholder="State*"
                                required
                                error={errors.courierState?.message}

                            />
                            <HookFormInputField
                                name="courierPincode"
                                control={control}
                                placeholder="Pincode*"
                                required
                                error={errors.courierPincode?.message}

                            />
                        </div>
                        <HookFormInputField
                            name="courierContact"
                            control={control}
                            placeholder="Contact Number*"
                            required
                            error={errors.courierContact?.message}

                        />
                    </div>
                )}
                <HookFormInputField
                    name="remarks"
                    control={control}
                    placeholder="Enter remarks"
                    label="Remarks"
                />
                <div className="mt-8 max-w-md mx-auto p-6 
                       bg-white dark:bg-gray-800 
                       border border-gray-200 dark:border-gray-700 
                       border-l-4 border-l-blue-600 
                        rounded-lg panel">
                    <div className="mb-6 p-3 bg-green-50 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg text-sm">
                        The <span className="font-semibold">Prajna Contest Kit</span> will be provided for your preparation.
                        <br />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                        You may also opt language preference
                    </span>
                    <div className="mt-1 mb-5 space-y-3 border rounded-lg p-2 bg-[#fff9ed] border-red-900">

                        <label className="flex items-center justify-between gap-2 cursor-pointer mb-0 p-1">

                            <span className="text-sm text-gray-700 dark:text-gray-200">
                                English Bhagavad Gita (+ ₹100)
                            </span>
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-blue-600 border-gray-400 bg-white"
                                checked={services.language}
                                onChange={() => handleServiceChange("language")}
                            />
                        </label>
                    </div>

                    <div className='border-b border-l-2 mb-2'></div>

                    <div className="space-y-3 text-sm">
                        {/* Registration */}
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Registration Charge</span>
                            <span className="font-medium text-gray-800 dark:text-gray-100">
                                ₹{registrationCharge}
                            </span>
                        </div>

                        {/* Language */}
                        {services.language && (
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">
                                    Bhagavad Gita (English) <span className="text-xs text-gray-500"></span>
                                </span>
                                <span className="font-medium text-gray-800 dark:text-gray-100">+ ₹100</span>
                            </div>
                        )}

                        {/* Courier */}
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

                        {/* Total */}
                        <div className="flex justify-between text-base font-bold">
                            <span className="text-gray-900 dark:text-white">Total Amount</span>
                            <span className="text-blue-600 dark:text-blue-400">₹{total}</span>
                        </div>
                    </div>
                </div>


                <div className="mt-4 space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        {/* <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-blue-600"
                        /> */}
                        <HookFormInputField
                            name="agree"
                            control={control}

                            required
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600 border-gray-400 bg-whit"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-200">
                            Details must be as per your Institute ID Card
                            otherwise your registration is invalid
                        </span>
                    </label>
                    {errors.agree?.message && <span className='text-red-500 text-sm mt-1'>{errors.agree?.message}</span>}
                </div>
                <Captcha
                    onChange={(token: any) => setValue("captcha", token, { shouldValidate: true })}
                    onExpired={() => setValue("captcha", "", { shouldValidate: true })}
                />

                <div className="hidden">
                    <HookFormInputField
                        name="captcha"
                        control={control}
                        type="hidden"
                    />
                </div>

                {errors.captcha?.message &&
                    <span className="text-red-500 text-sm inline lg:block md:block  text-center leading-none">{errors.captcha?.message}</span>
                }



                <button type="submit" className="btn btn-gradient p-3 !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                    Next
                </button>
            </form>
            <button onClick={()=>handleRegister({name:"anil", email:"kk", dob:""})}>submit</button>


        </>
    );
};

export default ComponentsAuthRegisterForm;
