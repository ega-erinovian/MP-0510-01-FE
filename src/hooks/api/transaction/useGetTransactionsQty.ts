import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface GetTransactionQuantityQuery {
  timeFilter: string;
  eventId?: number;
  userId?: number;
}

const useGetTransactionsQty = (queries: GetTransactionQuantityQuery) => {
  return useQuery({
    queryKey: ["transactionsQty", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        "/transactions/filter/quantity",
        { params: queries }
      );

      return data;
    },
  });
};

export default useGetTransactionsQty;
