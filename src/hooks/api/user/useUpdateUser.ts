import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateUserPayload) => {
      const updateUserForm = new FormData();

      if (payload.fullName) updateUserForm.append("fullName", payload.fullName);
      if (payload.email) updateUserForm.append("email", payload.email);
      if (payload.password) updateUserForm.append("password", payload.password);
      if (payload.phoneNumber)
        updateUserForm.append("phoneNumber", payload.phoneNumber);
      if (payload.profilePicture) {
        updateUserForm.append("profilePicture", payload.profilePicture);
      }

      const { data } = await axiosInstance.patch(
        `/users/${payload.id}`,
        updateUserForm
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
