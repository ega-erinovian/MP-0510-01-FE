import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const useDeleteUser = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.delete(`/users/${id}`);
      return data;
    },
    onSuccess: async () => {
      console.log(`User deleted successfully`);
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useDeleteUser;
