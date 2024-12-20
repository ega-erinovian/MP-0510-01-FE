import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  profilePicture?: File | null;
  referralCode?: string | null;
  phoneNumber: string;
  role: string;
  cityId: number;
}

const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const registerForm = new FormData();

      registerForm.append("fullName", payload.fullName);
      registerForm.append("email", payload.email);
      registerForm.append("password", payload.password);
      if (payload.profilePicture) {
        registerForm.append("profilePicture", payload.profilePicture);
      }

      if (payload.referralCode) {
        registerForm.append("referralCode", payload.referralCode);
      }

      registerForm.append("phoneNumber", payload.phoneNumber);
      registerForm.append("role", payload.role);
      registerForm.append("cityId", String(payload.cityId));

      const { data } = await axiosInstance.post("/auth/register", registerForm);
      return data;
    },
    onSuccess: () => {
      toast.success("Account Created Successfullly");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useRegister;
