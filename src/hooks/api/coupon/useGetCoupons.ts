import { axiosInstance } from "@/lib/axios";
import { CouponType } from "@/types/coupon";
import { useQuery } from "@tanstack/react-query";

interface GetCouponsQuery {
  userId?: number;
  search?: string;
}

const useGetCoupons = (queries: GetCouponsQuery) => {
  return useQuery({
    queryKey: ["coupons", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<CouponType>("/coupons", {
        params: queries,
      });

      return data;
    },
  });
};

export default useGetCoupons;
