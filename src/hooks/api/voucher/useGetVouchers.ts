import { axiosInstance } from "@/lib/axios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

interface GetVoucherQuery extends PaginationQueries {
  search?: string;
}

const useGetVouchers = (queries: GetVoucherQuery) => {
  return useQuery({
    queryKey: ["vouchers", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<VoucherType>>(
        "/vouchers",
        { params: queries }
      );

      return data;
    },
  });
};

export default useGetVouchers;
