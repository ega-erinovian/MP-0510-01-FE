import * as Yup from "yup";
import YupPassword from "yup-password";

YupPassword(Yup);

export const updateUserSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  profilePicture: Yup.string().nullable(),
  phoneNumber: Yup.number().required("Phone Number is required"),
});
