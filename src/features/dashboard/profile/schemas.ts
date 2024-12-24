import * as Yup from "yup";
import YupPassword from "yup-password";

YupPassword(Yup);

export const updateUserSchema = Yup.object().shape({
  fullName: Yup.string().optional(),
  email: Yup.string().optional(),
  profilePicture: Yup.string().nullable(),
  phoneNumber: Yup.number().optional(),
});
