import * as Yup from "yup";
import YupPassword from "yup-password";

YupPassword(Yup);

export const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});
