import * as Yup from "yup";
import YupPassword from "yup-password";

YupPassword(Yup);

export const updateUserSchema = Yup.object().shape({
  fullName: Yup.string().optional(),
  email: Yup.string().optional(),
  profilePicture: Yup.string().nullable(),
  phoneNumber: Yup.number().optional(),
});

export const UpdatePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .minLowercase(1)
    .minUppercase(1)
    .min(4),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});
