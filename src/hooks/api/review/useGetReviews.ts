import { axiosInstance } from "@/lib/axios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { ReviewType } from "@/types/review";
import { useQuery } from "@tanstack/react-query";

interface GetReviewQuery extends PaginationQueries {
  userId?: number;
  eventId?: number;
}

const useGetReviews = (queries: GetReviewQuery) => {
  return useQuery({
    queryKey: ["reviews", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<ReviewType>>(
        "/reviews",
        { params: queries }
      );

      return data;
    },
  });
};

export default useGetReviews;
