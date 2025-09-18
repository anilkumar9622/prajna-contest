import * as yup from "yup";

export const formSchema = yup.object({
  name: yup.string().required("Full name is required"),
  gender: yup.string().required("Gender is required"),
  dob: yup
    .string()
    .required("Date of birth is required")
    .test("valid-date", "Date of birth cannot be in the future", (value) =>
      value ? new Date(value) <= new Date() : false
    ),

  email: yup.string().email().required("Email is required"),
  phone: yup.string().matches(/^[0-9]{10}$/, "Phone must be 10 digits").required(),
  instituteType: yup.string().required("Institute type is required"),
  institute: yup.string().required("Institute Name is required"),
  regBace: yup.string().required("Registration BACE is required"),
  registrationType: yup.string().required("Registration type is required"),

  collectorName: yup.string().when("registrationType", {
    is: "offline",
    then: (schema) => schema.required("Collector name is required"),
    otherwise: (schema) => schema.optional(),
  }),

  collectorContact: yup.string().when("registrationType", {
    is: "offline",
    then: (schema) =>
      schema
        .matches(/^[0-9]{10}$/, "Contact must be 10 digits")
        .required("Collector contact is required"),
    otherwise: (schema) => schema.optional(),
  }),

  isCourier: yup.boolean().optional(),

  courierHouseNo: yup.string().when("isCourier", {
    is: true,
    then: (schema) => schema.required("House No is required"),
    otherwise: (schema) => schema.optional(),
  }),

  courierLine1: yup.string().when("isCourier", {
    is: true,
    then: (schema) => schema.required("Address Line 1 is required"),
    otherwise: (schema) => schema.optional(),
  }),

  courierLine2: yup.string().optional(), // usually not required

  courierCity: yup.string().when("isCourier", {
    is: true,
    then: (schema) => schema.required("City is required"),
    otherwise: (schema) => schema.optional(),
  }),

  courierDistrict: yup.string().when("isCourier", {
    is: true,
    then: (schema) => schema.required("District is required"),
    otherwise: (schema) => schema.optional(),
  }),

  courierState: yup.string().when("isCourier", {
    is: true,
    then: (schema) => schema.required("State is required"),
    otherwise: (schema) => schema.optional(),
  }),

  courierPincode: yup
    .string()
    .when("isCourier", {
      is: true,
      then: (schema) =>
        schema
          .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
          .required("Pincode is required"),
      otherwise: (schema) => schema.optional(),
    }),

  courierContact: yup
    .string()
    .when("isCourier", {
      is: true,
      then: (schema) =>
        schema
          .matches(/^[0-9]{10}$/, "Courier contact must be 10 digits")
          .required("Courier contact is required"),
      otherwise: (schema) => schema.optional(),
    }),


  remarks: yup.string().max(500).optional(),

  agree: yup.boolean().oneOf([true], "You must agree to the terms").required(),
  captcha: yup
    .string()
    .required("Captcha verification is required"),

});

// export type FormValues = yup.InferType<typeof formSchema>; // 👈 single source of truth

