import { axiosInstance } from "@/lib/axios";
import { VoucherType } from "@/types/voucher";
import { useQuery } from "@tanstack/react-query";

const useGetVoucher = (id: number) => {
  return useQuery({
    queryKey: ["vouchers", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<VoucherType>(`/vouchers/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 0,
  });
};

export default useGetVoucher;
