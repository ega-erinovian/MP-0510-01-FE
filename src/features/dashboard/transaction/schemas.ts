import * as Yup from "yup";
import YupPassword from "yup-password";

YupPassword(Yup);

export const updateTransactionSchema = Yup.object().shape({
  status: Yup.string().min(4),
});
