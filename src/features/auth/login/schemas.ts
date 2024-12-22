import * as Yup from "yup";
import YupPassword from "yup-password";

YupPassword(Yup);

export const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .minLowercase(1)
    .minUppercase(1)
    .min(4),
});
