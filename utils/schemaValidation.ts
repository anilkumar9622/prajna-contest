// import * as yup from "yup";

// export const formSchema = yup.object({
//   name: yup.string().required("Full name is required"),
//   gender: yup.string().required("Gender is required"),
//   dob: yup
//     .string()
//     .required("Date of birth is required")
//     .test("valid-date", "Date of birth cannot be in the future", (value) =>
//       value ? new Date(value) <= new Date() : false
//     ),

//   email: yup.string().email().required("Email is required"),
//   phone: yup.string().matches(/^[0-9]{10}$/, "Phone must be 10 digits").required(),
//   instituteType: yup.string().required("Institute type is required"),
//   institute: yup.string().required("Institute Name is required"),
//   regBace: yup.string().required("Registration BACE is required"),
//   registrationType: yup.string().required("Registration type is required"),

//   collectorName: yup.string().when("registrationType", {
//     is: "offline",
//     then: (schema) => schema.required("Collector name is required"),
//     otherwise: (schema) => schema.optional(),
//   }),

//   collectorContact: yup.string().when("registrationType", {
//     is: "offline",
//     then: (schema) =>
//       schema
//         .matches(/^[0-9]{10}$/, "Contact must be 10 digits")
//         .required("Collector contact is required"),
//     otherwise: (schema) => schema.optional(),
//   }),

//   isCourier: yup.boolean().optional(),

//   courierHouseNo: yup.string().when("isCourier", {
//     is: true,
//     then: (schema) => schema.required("House No is required"),
//     otherwise: (schema) => schema.optional(),
//   }),

//   courierLine1: yup.string().when("isCourier", {
//     is: true,
//     then: (schema) => schema.required("Address Line 1 is required"),
//     otherwise: (schema) => schema.optional(),
//   }),

//   courierLine2: yup.string().optional(), // usually not required

//   courierCity: yup.string().when("isCourier", {
//     is: true,
//     then: (schema) => schema.required("City is required"),
//     otherwise: (schema) => schema.optional(),
//   }),

//   courierDistrict: yup.string().when("isCourier", {
//     is: true,
//     then: (schema) => schema.required("District is required"),
//     otherwise: (schema) => schema.optional(),
//   }),

//   courierState: yup.string().when("isCourier", {
//     is: true,
//     then: (schema) => schema.required("State is required"),
//     otherwise: (schema) => schema.optional(),
//   }),

//   courierPincode: yup
//     .string()
//     .when("isCourier", {
//       is: true,
//       then: (schema) =>
//         schema
//           .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
//           .required("Pincode is required"),
//       otherwise: (schema) => schema.optional(),
//     }),

//   courierContact: yup
//     .string()
//     .when("isCourier", {
//       is: true,
//       then: (schema) =>
//         schema
//           .matches(/^[0-9]{10}$/, "Courier contact must be 10 digits")
//           .required("Courier contact is required"),
//       otherwise: (schema) => schema.optional(),
//     }),


//   remarks: yup.string().max(500).optional(),

//   agree: yup.boolean().oneOf([true], "You must agree to the terms").required(),
//   captcha: yup
//     .string()
//     .required("Captcha verification is required"),

// });

// schemaValidation.ts
import * as yup from "yup";

export type Representative = {
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

export type FormValues = {
  name: string;
  gender: string;
  dob: string;
  email: string;
  phone: string;
  instituteType: string;
  institute: string;
  regBace: string;
  registrationType: string;
  representative: Representative;
  isCourier?: boolean;
  courier: Courier;
  remarks?: string;
  agree: boolean;
  captcha: string;
};

// Base schema with common fields
const baseFields = {
  name: yup.string().required("Full name is required"),
  gender: yup.string().required("Gender is required"),
  dob: yup
    .string()
    .required("Date of birth is required")
    .test(
      "valid-date",
      "Date of birth cannot be in the future",
      (value) => (value ? new Date(value) <= new Date() : false)
    ),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
  instituteType: yup.string().required("Institute type is required"),
  institute: yup.string().required("Institute Name is required"),
  regBace: yup.string().required("Registration BACE is required"),
  registrationType: yup.string().required("Registration type is required"),
  remarks: yup.string().max(500).optional(),
  agree: yup
    .boolean()
    .oneOf([true], "You must agree to the terms")
    .required("Agreement is required"),
  captcha: yup.string().required("Captcha verification is required"),
};

// Online registration schema
export const onlineSchema = yup.object({
  ...baseFields,
  
  // Representative not required for online
  representative: yup.object({
    name: yup.string().notRequired(),
    contact: yup.string().notRequired(),
  }),
  
  isCourier: yup.boolean().optional(),
  
  // Courier fields only required when isCourier is true
  courier: yup.object({
    houseNo: yup.string().when('$isCourier', {
      is: true,
      then: (schema) => schema.required("House No is required"),
      otherwise: (schema) => schema.notRequired()
    }),
    line1: yup.string().when('$isCourier', {
      is: true,
      then: (schema) => schema.required("Address Line 1 is required"),
      otherwise: (schema) => schema.notRequired()
    }),
    line2: yup.string().optional(),
    city: yup.string().when('$isCourier', {
      is: true,
      then: (schema) => schema.required("City is required"),
      otherwise: (schema) => schema.notRequired()
    }),
    district: yup.string().when('$isCourier', {
      is: true,
      then: (schema) => schema.required("District is required"),
      otherwise: (schema) => schema.notRequired()
    }),
    state: yup.string().when('$isCourier', {
      is: true,
      then: (schema) => schema.required("State is required"),
      otherwise: (schema) => schema.notRequired()
    }),
    pincode: yup.string().when('$isCourier', {
      is: true,
      then: (schema) => schema.matches(/^[0-9]{6}$/, "Pincode must be 6 digits").required("Pincode is required"),
      otherwise: (schema) => schema.notRequired()
    }),
    contact: yup.string().when('$isCourier', {
      is: true,
      then: (schema) => schema.matches(/^[0-9]{10}$/, "Courier contact must be 10 digits").required("Courier contact is required"),
      otherwise: (schema) => schema.notRequired()
    })
  })
});

// Offline registration schema
export const offlineSchema = yup.object({
  ...baseFields,
  
  // Representative required for offline
  representative: yup.object({
    name: yup.string().required("Representative name is required"),
    contact: yup
      .string()
      .matches(/^[0-9]{10}$/, "Contact must be 10 digits")
      .required("Representative contact is required"),
  }),
  
  isCourier: yup.boolean().optional(),
  
  // Courier fields not required for offline
  courier: yup.object({
    houseNo: yup.string().notRequired(),
    line1: yup.string().notRequired(),
    line2: yup.string().optional(),
    city: yup.string().notRequired(),
    district: yup.string().notRequired(),
    state: yup.string().notRequired(),
    pincode: yup.string().notRequired(),
    contact: yup.string().notRequired()
  })
});

// Function to get appropriate schema based on registration type
export const getValidationSchema = (registrationType: string) => {
  if (registrationType === 'online') {
    return onlineSchema;
  } else if (registrationType === 'offline') {
    return offlineSchema;
  } else {
    throw new Error('Invalid registration type');
  }
};

// Keep the original formSchema for backward compatibility (basic validation)
export const formSchema = yup.object(baseFields);

export type FormValuess = yup.InferType<typeof onlineSchema>;


