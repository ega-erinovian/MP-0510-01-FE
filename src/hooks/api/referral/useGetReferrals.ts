import { axiosInstance } from "@/lib/axios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { ReviewType } from "@/types/review";
import { useQuery } from "@tanstack/react-query";

interface GetReferralQuery extends PaginationQueries {
  userId?: number;
  eventId?: number;
}

const useGetReferrals = (queries: GetReferralQuery) => {
  return useQuery({
    queryKey: ["referrals", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<ReviewType>>(
        "/referrals",
        { params: queries }
      );

      return data;
    },
  });
};

export default useGetReferrals;
