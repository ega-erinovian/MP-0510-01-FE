import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface UpdateTransactionPayload {
  id: number;
  status: string;
  email: string;
}

const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateTransactionPayload) => {
      const { data } = await axiosInstance.patch(
        `/transactions/${payload.id}`,
        payload
      );
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction Updated Successfullly");
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

export default useUpdateTransaction;
