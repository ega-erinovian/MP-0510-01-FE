import { axiosInstance } from "@/lib/axios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { TransactionType } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";

interface GetReviewQuery extends PaginationQueries {
  userId?: number;
}

const useGetReviews = (queries: GetReviewQuery) => {
  return useQuery({
    queryKey: ["reviews", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        PageableResponse<TransactionType>
      >("/reviews", { params: queries });

      return data;
    },
  });
};

export default useGetReviews;
