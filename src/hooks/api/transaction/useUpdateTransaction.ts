import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface UpdateTransactionPayload {
  id: number;
  status: string;
  email: string;
  paymentProof: File | null;
}

const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const { axiosInstance } = useAxios();

  return useMutation({
    mutationFn: async (payload: UpdateTransactionPayload) => {
      const formData = new FormData();

      if (payload.status) formData.append("status", payload.status);
      if (payload.email) formData.append("email", payload.email);
      if (payload.paymentProof) {
        formData.append("paymentProof", payload.paymentProof);
      }

      const { data } = await axiosInstance.patch(
        `/transactions/${payload.id}`,
        formData
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
