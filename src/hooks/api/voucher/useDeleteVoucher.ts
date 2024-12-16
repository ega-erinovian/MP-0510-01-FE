import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const useDeleteVoucher = () => {
  // const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.delete(`/vouchers/${id}`);
      return data;
    },
    onSuccess: async () => {
      toast.success(`Voucher deleted successfully`);
      await queryClient.invalidateQueries({ queryKey: ["vouchers"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useDeleteVoucher;
