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
import Swal from 'sweetalert2';
import SendEmailPage from './EmailSend';

const ComponentsAuthRegisterForm = ({ onVerify, verifiedLabel = "Verified", className = "", }: any) => {
    const [registrationType, setRegistrationType] = useState("");

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
            dob: "", // string
            email: "",
            phone: "",
            instituteType: "",
            institute: "",
            regBace: "",
            registrationType: "",

            // representative object
            representative: {
                name: "",
                contact: "",
            },

            isCourier: false, // controls courier fields
            courier: {
                houseNo: "",
                line1: "",
                line2: "",
                city: "",
                district: "",
                state: "",
                pincode: "",
                contact: "",
            },

            remarks: "",
            agree: false,
            captcha: "",
        }

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

    // const [registrationType, setRegistrationType] = useState("");
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
 
    const [registrationCharge, setRegistrationCharge] = useState<number>(0);
    const instituteTypeHandler = (value: string | number) => {
  if (value === "school") setRegistrationCharge(200);
  else if (value === "college") setRegistrationCharge(300);
  else setRegistrationCharge(0); // default if needed
};

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
    const onSubmit = async (formData: any) => {
        // const {captcha, ...val} = formData
        console.log
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (res.status === 201) {
            showMessage("Registered successfully!", "success");
            router.push("/dashboard");
        } else if (res.status === 400) {
            showMessage(data.errors.join(", "), "error");
        } else {
            showMessage(data.error || "Something went wrong!", "error");
        }
        console.log(data);
    };
    const error = (errors: any) => {
        console.log("errors", errors);
        showMessage(errors.message || "Validation Error", "error");
    }



    return (
        <>
            <form className="space-y-5 dark:text-white" onSubmit={handleSubmit(onSubmit, error)}>
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
                        callback={instituteTypeHandler}
                        placeholder="Select Institute Type"
                        options={[
                            { value: "school", label: "School (Class 9 and above only)" },
                            { value: "college", label: "College" },
                        ]}
                        required
                        error={errors.instituteType?.message}
                    />
                </div>
                {/* <div className="flex items-center p-3.5 rounded text-secondary bg-secondary-light dark:bg-secondary-dark-light">
                    <span className="ltr:pr-2 rtl:pl-2">
                        <strong className="ltr:mr-1 rtl:ml-1">Alert!</strong> Make sure the student is in class 9 or higher.

                    </span>
                    <button type="button" className="ltr:ml-auto rtl:mr-auto hover:opacity-80">
                    </button>
                </div> */}


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
                            name="representative.name"
                            control={control}
                            label="Representative Name"
                            placeholder="Enter Name"
                            required
                            error={errors.representative?.name?.message}
                        />
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
                            name="courier.houseNo"
                            control={control}
                            placeholder="House No., Building Name *"
                            required
                            error={errors.courier?.houseNo?.message}

                        />
                        <HookFormInputField
                            name="courier.line1"
                            control={control}
                            placeholder="Address Line 1"
                        />
                        <HookFormInputField
                            name="courier.line2"
                            control={control}
                            placeholder="Address Line 2"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <HookFormInputField
                                name="courier.city"
                                control={control}
                                placeholder="City*"
                                required
                                error={errors.courier?.city?.message}

                            />
                            <HookFormInputField
                                name="courier.district"
                                control={control}
                                placeholder="District"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <HookFormInputField
                                name="courier.state"
                                control={control}
                                placeholder="State*"
                                required
                                error={errors.courier?.state?.message}

                            />
                            <HookFormInputField
                                name="courier.pincode"
                                control={control}
                                placeholder="Pincode*"
                                required
                                error={errors.courier?.pincode?.message}

                            />
                        </div>
                        <HookFormInputField
                            name="courier.contact"
                            control={control}
                            placeholder="Contact Number*"
                            required
                            error={errors.courier?.contact?.message}

                        />
                    </div>
                )}
                <HookFormInputField
                    name="remarks"
                    control={control}
                    placeholder="Enter remarks"
                    label="Remarks"
                />
                <div className="mt-8 max-w-md mx-auto  px-4 lg:p-6
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
                {/* <SendEmailPage/> */}
            </form>

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

export default ComponentsAuthRegisterForm;
