import * as Yup from "yup";
import YupPassword from "yup-password";

YupPassword(Yup);

export const CreateVoucherSchema = Yup.object().shape({
  code: Yup.string().required("Code is required"),
  amount: Yup.number().required("Amount is required").min(1),
  expiresAt: Yup.date().required("Expire date is required"),
  eventId: Yup.number().required("Event ID is required"),
});
