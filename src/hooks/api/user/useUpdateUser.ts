import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface UpdateUserPayload {
  id: number;
  fullName?: string;
  email?: string;
  password?: string;
  profilePicture?: File | null;
  phoneNumber?: string;
  point?: number;
  pointExpired?: Date;
}

const useUpdateUser = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateUserPayload) => {
      const registerForm = new FormData();

      if (payload.fullName) registerForm.append("fullName", payload.fullName);
      if (payload.email) registerForm.append("email", payload.email);
      if (payload.password) registerForm.append("password", payload.password);
      if (payload.phoneNumber)
        registerForm.append("phoneNumber", payload.phoneNumber);
      if (payload.profilePicture) {
        registerForm.append("profilePicture", payload.profilePicture);
      }

      const { data } = await axiosInstance.patch(
        `/users/${payload.id}`,
        registerForm
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      toast.success("User Updated Successfullly");
    },

    onError: (error: AxiosError<any>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "An error occurred";
      toast.error(errorMessage);
    },
  });
};

export default useUpdateUser;
