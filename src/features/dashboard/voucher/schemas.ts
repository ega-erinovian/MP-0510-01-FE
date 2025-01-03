import * as Yup from "yup";
import YupPassword from "yup-password";

YupPassword(Yup);

export const CreateVoucherSchema = Yup.object().shape({
  code: Yup.string().min(4).required("Code is required"),
  amount: Yup.number().min(1000).required("Amount is required"),
  expiresAt: Yup.date().required("Expire date is required"),
  eventId: Yup.number().required("Event ID is required"),
});

export const updateVoucherSchema = Yup.object().shape({
  code: Yup.string().min(4).required("Code is required"),
  amount: Yup.number().min(1000).required("Amount is required"),
  expiresAt: Yup.date().required("Expire date is required"),
  eventId: Yup.number().required("Event ID is required"),
  isUsed: Yup.string()
    .oneOf(["AVAILABLE", "USED", "EXPIRED"], "Invalid status")
    .required("Status is required"),
});
