import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface UpdateUserPayload {
  id: number;
  fullName?: string;
  email?: string;
  password?: string;
  profilePicture?: string;
  phoneNumber?: string;
  cityId?: number;
  point?: number;
  pointExpired?: Date;
}

const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateUserPayload) => {
      const { data } = await axiosInstance.patch(
        `/users/${payload.id}`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      console.log("User Updated Successfullly");
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "An error occurred";
      console.log(errorMessage);
    },
  });
};

export default useUpdateUser;
