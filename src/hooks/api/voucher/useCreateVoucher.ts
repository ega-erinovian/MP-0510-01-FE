import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface CreateVoucherPayload {
  eventId: number;
  code: string;
  amount: number;
  expiresAt: string;
}

const useCreateVoucher = () => {
  return useMutation({
    mutationFn: async (payload: CreateVoucherPayload) => {
      const { data } = await axiosInstance.post("/vouchers", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Voucher Created Successfullly");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useCreateVoucher;
