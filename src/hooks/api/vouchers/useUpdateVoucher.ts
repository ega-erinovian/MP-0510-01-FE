import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface UpdateVoucherPayload {
  eventId?: number;
  code?: string;
  amount?: number;
  expiresAt?: string;
  isUsed?: boolean;
}

const useUpdateVoucher = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateVoucherPayload) => {
      const { data } = await axiosInstance.patch(`/vouchers/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voucher", id] });
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      toast.success("Voucher Updated Successfullly");
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

export default useUpdateVoucher;
