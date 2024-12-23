import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface GetTransactionIncomeQuery {
  timeFilter: string;
  eventId?: number;
  userId?: number;
}

const useGetTransactionsIncome = (queries: GetTransactionIncomeQuery) => {
  return useQuery({
    queryKey: ["transactionsIncome", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/transactions/filter/income", {
        params: queries,
      });

      return data;
    },
  });
};

export default useGetTransactionsIncome;
