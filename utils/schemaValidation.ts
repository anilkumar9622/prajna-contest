import * as yup from 'yup';

export type Volunteer = {
    name: string;
    contact: string;
};

export type Courier = {
    houseNo: string;
    line1: string;
    line2?: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    contact: string;
};
export type Payment = {
    status: 'pending' | 'success' | 'failed'; // enum-like string union
    paymentId?: string;
    orderId?: string;
    updatedAt?: Date;
    amount: string;
};

export type FormValues = {
    id: string;
    createdAt: string;
    // firstName: string; --- IGNORE ---
    name: string;
    gender: string;
    dob: string; // string for simplicity
    email: string;
    phone: string;
    instituteType: string;
    institute: string;
    regBace: string;
    registrationPaymentMode: string;
    paymentStatus: string;
    paymentId?: string;
    paymentAmount?: string;
    volunteer: Volunteer;
    isCourier?: boolean;
    courier: Courier;
    remarks?: string;
    agree: boolean;
    captcha: string;
    payment: Payment;
    totalRegistrationAmount: string;
};

// ----------------------
// Yup Validation Schema
// ----------------------

export const formSchema = yup.object().shape({
    name: yup.string().required('Full name is required'),
    gender: yup.string().required('Gender is required'),
    dob: yup
        .string()
        .required('Date of birth is required')
        .test('valid-date', 'Date of birth cannot be in the future', (value) => (value ? new Date(value) <= new Date() : false)),
    // email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup
        .string()
        .matches(/^[0-9]{10}$/, 'Phone must be 10 digits')
        .required('Phone is required'),
    instituteType: yup.string().required('Institute type is required'),
    institute: yup.string().required('Institute Name is required'),
    regBace: yup.string().required('Registration BACE is required'),
    registrationPaymentMode: yup.string().required('Registration Payment Mode is required'),
    email: yup
        .string()
        .email('Invalid email')
        .when('registrationPaymentMode', {
            is: 'online',
            then: (schema) => schema.required('Email is required'),
            otherwise: (schema) => schema.notRequired(),
        }),
    // Representative required only for offline
    volunteer: yup
        .object({
            name: yup.string(),
            contact: yup.string(),
        })
        .when('registrationPaymentMode', {
            is: 'offline',
            then: (schema) =>
                schema.shape({
                    name: yup.string().required('volunteer name is required'),
                    contact: yup
                        .string()
                        .matches(/^[0-9]{10}$/, 'Contact must be 10 digits')
                        .required('volunteer contact is required'),
                }),
            otherwise: (schema) => schema.notRequired(),
        }),

    isCourier: yup.boolean().optional(),

    // Courier fields optional unless isCourier is true
    courier: yup
        .object({
            houseNo: yup.string(),
            line1: yup.string().optional(),
            line2: yup.string().optional(),
            city: yup.string(),
            district: yup.string().optional(),
            state: yup.string(),
            pincode: yup.string(),
            contact: yup.string(),
        })
        .when('isCourier', {
            is: true,
            then: (schema) =>
                schema.shape({
                    houseNo: yup.string().required('House No is required'),
                    city: yup.string().required('City is required'),
                    state: yup.string().required('State is required'),
                    pincode: yup
                        .string()
                        .matches(/^[0-9]{6}$/, 'Pincode must be 6 digits')
                        .required('Pincode is required'),
                    contact: yup
                        .string()
                        .matches(/^[0-9]{10}$/, 'Courier contact must be 10 digits')
                        .required('Courier contact is required'),
                }),
            otherwise: (schema) => schema.notRequired(),
        }),

    remarks: yup.string().max(500).optional(),

    agree: yup.boolean().oneOf([true], 'You must agree to the terms').required('Agreement is required'),

    captcha: yup.string().required('Captcha verification is required'),
    payment: yup.object({
        status: yup.string().oneOf(['pending', 'success', 'failed']).default('pending').required(),
        paymentId: yup.string().optional(),
        orderId: yup.string().optional(),
        updatedAt: yup
            .date()
            .default(() => new Date())
            .optional(),
        amount: yup.string().optional(),
    }),
    totalRegistrationAmount: yup.string().optional(),
});

export const LevelFormSchema = yup.object().shape({
    fullSpiritualName: yup.string().required('Full spiritual name is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),

    gender: yup.string().required('Gender is required'),

    dob: yup
        .string()
        .required('Date of birth is required')
        .test('valid-date', 'Date of birth cannot be in the future', (value) => (value ? new Date(value) <= new Date() : false)),

    email: yup.string().email('Invalid email').required('Email is required'),

    mobile: yup
        .string()
        .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
        .required('Mobile number is required'),

    whatsapp: yup
        .string()
        .matches(/^[0-9]{10}$/, 'WhatsApp number must be 10 digits')
        .required('WhatsApp number is required'),

    stayLocation: yup.string().required('Please select where you stay'),


    counselorName: yup.string().required('Counselor / Facilitator name is required'),

    languagePreference: yup.string().required('Language preference is required'),


    regBace: yup.string().required('Registering BACE is required'),

    registrationPaymentMode: yup.string().required('Registration Payment Mode is required'),

    volunteer: yup
        .object({
            name: yup.string(),
            contact: yup.string(),
        })
        .when('registrationPaymentMode', {
            is: 'offline',
            then: (schema) =>
                schema.shape({
                    name: yup.string().required('Volunteer name is required'),
                    contact: yup
                        .string()
                        .matches(/^[0-9]{10}$/, 'Volunteer contact must be 10 digits')
                        .required('Volunteer contact is required'),
                }),
            otherwise: (schema) => schema.notRequired(),
        }),

    isCourier: yup.boolean().optional(),

    courier: yup
        .object({
            houseNo: yup.string(),
            line1: yup.string().optional(),
            line2: yup.string().optional(),
            city: yup.string(),
            district: yup.string().optional(),
            state: yup.string(),
            pincode: yup.string(),
            contact: yup.string(),
        })
        .when('isCourier', {
            is: true,
            then: (schema) =>
                schema.shape({
                    houseNo: yup.string().required('House No is required'),
                    city: yup.string().required('City is required'),
                    state: yup.string().required('State is required'),
                    pincode: yup
                        .string()
                        .matches(/^[0-9]{6}$/, 'Pincode must be 6 digits')
                        .required('Pincode is required'),
                    contact: yup
                        .string()
                        .matches(/^[0-9]{10}$/, 'Courier contact must be 10 digits')
                        .required('Courier contact is required'),
                }),
            otherwise: (schema) => schema.notRequired(),
        }),

    remarks: yup.string().max(500).optional(),

    // agree: yup.boolean().oneOf([true], 'You must agree to the terms').required('Agreement is required'),

    // captcha: yup.string().required('Captcha verification is required'),

    payment: yup.object({
        status: yup.string().oneOf(['pending', 'success', 'failed']).default('pending').required(),
        paymentId: yup.string().optional(),
        orderId: yup.string().optional(),
        updatedAt: yup
            .date()
            .default(() => new Date())
            .optional(),
        amount: yup.string().optional(),
    }),

    totalRegistrationAmount: yup.string().optional(),
});

export type FormValuess = yup.InferType<typeof formSchema>; // 👈 single source of truth

export interface LoginForm {
    email: string;
    password: string;
}

export const loginSchema = yup.object({
    email: yup.string().email().required('Email is required'),
    password: yup.string().required('Password is required'),
});
