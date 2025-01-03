import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface CreateCouponPayload {
  code: string;
  userId: number;
  amount: number;
  expiresAt: Date;
}

const useCreateCoupon = () => {
  return useMutation({
    mutationFn: async (payload: CreateCouponPayload) => {
      const { data } = await axiosInstance.post("/coupons", payload);
      return data;
    },
    onSuccess: () => {
      console.log("Coupon Created Successfullly");
    },
    onError: (error: AxiosError<any>) => {
      console.log(error.response?.data);
    },
  });
};

export default useCreateCoupon;
