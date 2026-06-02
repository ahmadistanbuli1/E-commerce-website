import * as yup from "yup";

export const loginSchema = yup
  .object({
    email: yup.string().email("Email Is Invalid").required("Email Is Required"),
    password: yup
      .string()
      .min(6, "Password Is Too Short")
      .max(25, "Password Is Too Long")
      .required("Password Is Required")
      .matches(/[A-Z]/, "Password Must Contain At Least One Uppercase Letter")
      .matches(/[a-z]/, "Password Must Contain At Least One Lowercase Letter")
      .matches(/[0-9]/, "Password Must Contain At Least One Number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password Must Contain At Least One Special Character",
      ),
  })
  .required();

export const RegisterSchema = yup
  .object({
    firstName: yup
      .string()
      .trim()
      .required("First Name Is Required")
      .min(3, "First Name Must Be At Least 3 Characters"),
    lastName: yup
      .string()
      .trim()
      .required("Last Name Is Required")
      .min(3, "Last Name Must Be At Least 3 Characters"),
    email: yup.string().email("Email Is Invalid").required("Email Is Required"),
    password: yup
      .string()
      .min(6, "Password Is Too Short")
      .max(25, "Password Is Too Long")
      .required("Password Is Required")
      .matches(/[A-Z]/, "Password Must Contain At Least One Uppercase Letter")
      .matches(/[a-z]/, "Password Must Contain At Least One Lowercase Letter")
      .matches(/[0-9]/, "Password Must Contain At Least One Number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password Must Contain At Least One Special Character",
      ),
  })
  .required();
