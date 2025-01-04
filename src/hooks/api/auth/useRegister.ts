import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  profilePicture?: File | null;
  referralCode?: string | null;
  phoneNumber: string;
  role: string;
  cityId: number;
  bankAccount?: string | null;
}

const useRegister = () => {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const registerForm = new FormData();

      registerForm.append("fullName", payload.fullName);
      registerForm.append("email", payload.email);
      registerForm.append("password", payload.password);
      registerForm.append("profilePicture", payload.profilePicture!);

      if (payload.referralCode) {
        registerForm.append("referralCode", payload.referralCode);
      }

      if (payload.bankAccount) {
        registerForm.append("bankAccount", payload.bankAccount);
      }

      registerForm.append("phoneNumber", payload.phoneNumber);
      registerForm.append("role", payload.role);
      registerForm.append("cityId", String(payload.cityId));

      const { data } = await axiosInstance.post("/auth/register", registerForm);
      return data;
    },
    onSuccess: () => {
      console.log("Account Created Successfullly");
    },
    onError: (error: AxiosError<any>) => {
      console.error(error.response?.data);
    },
  });
};

export default useRegister;
