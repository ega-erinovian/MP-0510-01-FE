import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export interface UpdateEventPayload {
  id: number;
  title?: string;
  description?: string;
  address?: string;
  price?: number;
  availableSeats?: number;
  thumbnnail?: File | null;
  startDate?: string;
  endDate?: string;
  categoryId?: number;
  cityId?: number;
}

const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const { axiosInstance } = useAxios();

  return useMutation({
    mutationFn: async (payload: UpdateEventPayload) => {
      const formData = new FormData();

      if (payload.title) formData.append("title", payload.title);
      if (payload.description)
        formData.append("description", payload.description);
      if (payload.address) formData.append("address", payload.address);
      if (payload.price) formData.append("price", `${payload.price}`);
      if (payload.availableSeats)
        formData.append("availableSeats", `${payload.availableSeats}`);
      if (payload.thumbnnail) {
        formData.append("thumbnnail", payload.thumbnnail);
      }
      if (payload.startDate) formData.append("startDate", payload.startDate);
      if (payload.endDate) formData.append("endDate", payload.endDate);
      if (payload.categoryId)
        formData.append("categoryId", `${payload.categoryId}`);
      if (payload.cityId) formData.append("cityId", `${payload.cityId}`);

      const { data } = await axiosInstance.patch(
        `/events/${payload.id}`,
        formData
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      console.log("Event Updated Successfullly");
    },

    onError: (error: AxiosError<any>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "An error occurred";
      toast.error(errorMessage);
    },
  });
};

export default useUpdateEvent;
