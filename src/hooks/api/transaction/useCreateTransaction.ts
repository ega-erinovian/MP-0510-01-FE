import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export interface CreateTransactionPayload {
  status: string;
  qty: number;
  totalPrice: number;
  userId: number;
  eventId: number;
  paymentProof: File | null;
}

const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { axiosInstance } = useAxios();

  return useMutation({
    mutationFn: async (payload: CreateTransactionPayload) => {
      const formData = new FormData();

      formData.append("userId", `${payload.userId}`);
      formData.append("eventId", `${payload.eventId}`);
      formData.append("status", payload.status);
      formData.append("qty", `${payload.qty}`); // Ensure qty is properly set
      formData.append("totalPrice", `${payload.totalPrice}`);
      if (payload.paymentProof)
        formData.append("paymentProof", payload.paymentProof);

      const { data } = await axiosInstance.post(`/transactions`, formData);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      console.log("Transaction Created Successfully");
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

export default useCreateTransaction;
