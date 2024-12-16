import { axiosInstance } from "@/lib/axios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { TransactionType } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";

interface GetTransactionQuery extends PaginationQueries {
  search?: string;
}

const useGetTransactions = (queries: GetTransactionQuery) => {
  return useQuery({
    queryKey: ["transactions", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        PageableResponse<TransactionType>
      >("/transactions", { params: queries });

      return data;
    },
  });
};

export default useGetTransactions;
