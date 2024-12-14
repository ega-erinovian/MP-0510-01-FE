import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const useDeleteVoucher = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.delete(`/vouchers/${id}`);

      if (!data) {
        throw new Error("No response received from the server");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers", id] });
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      toast.success("Voucher deleted successfully");
    },

    onError: (error: AxiosError<{ message: string }>) => {
      const { response } = error;
      const errorMessage = response?.data?.message || "An error occurred";

      if (response?.status === 404) {
        toast.error("Voucher not found");
      } else {
        toast.error(errorMessage);
      }
    },
  });
};

export default useDeleteVoucher;
