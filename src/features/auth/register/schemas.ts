import * as Yup from "yup";
import YupPassword from "yup-password";

YupPassword(Yup);

export const registerSchema = Yup.object().shape({
  fullName: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .minLowercase(1)
    .minUppercase(1)
    .min(4),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
  referralCode: Yup.string().nullable(),
  profilePicture: Yup.string().nullable(),
  phoneNumber: Yup.number().required("Phone number is required"),
  cityId: Yup.number()
    .required("City is required")
    .integer("City ID must be an integer")
    .positive("City ID must be greater than zero"),
});
