import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface GetTransactionIncomePerMonthQuery {
  eventId?: number;
  userId?: number;
}

const useGetTransactionsIncomePerMonth = (
  queries: GetTransactionIncomePerMonthQuery
) => {
  return useQuery({
    queryKey: ["transactionsIncomePerMonth", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        "/transactions/filter/income-per-month",
        {
          params: queries,
        }
      );

      return data;
    },
  });
};

export default useGetTransactionsIncomePerMonth;
