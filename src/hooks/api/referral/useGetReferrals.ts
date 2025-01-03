import { axiosInstance } from "@/lib/axios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { ReferralType } from "@/types/referrals";
import { useQuery } from "@tanstack/react-query";

interface GetReferralQuery extends PaginationQueries {
  userId?: number;
}

const useGetReferrals = (queries: GetReferralQuery) => {
  return useQuery({
    queryKey: ["referrals", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<ReferralType>>(
        "/referrals",
        { params: queries }
      );

      return data;
    },
  });
};

export default useGetReferrals;
