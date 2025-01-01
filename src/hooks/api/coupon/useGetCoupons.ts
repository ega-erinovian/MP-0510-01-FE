import { axiosInstance } from "@/lib/axios";
import { CouponType } from "@/types/coupon";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

interface GetCouponsQuery extends PaginationQueries {
  userId?: number;
  search?: string;
}

const useGetCoupons = (queries: GetCouponsQuery) => {
  return useQuery({
    queryKey: ["coupons", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<CouponType>>(
        "/coupons",
        {
          params: queries,
        }
      );

      return data;
    },
  });
};

export default useGetCoupons;
