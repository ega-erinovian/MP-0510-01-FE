import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const useDeleteEvent = () => {
  // const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.delete(`/events/${id}`);
      return data;
    },
    onSuccess: async () => {
      toast.success(`Event deleted successfully`);
      await queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useDeleteEvent;
