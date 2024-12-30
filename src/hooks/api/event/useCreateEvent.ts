import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export interface CreateEventPayload {
  title: string;
  description: string;
  address: string;
  price: number;
  availableSeats: number;
  thumbnnail?: File | null;
  startDate: string;
  endDate: string;
  categoryId: number;
  cityId: number;
  userId: number;
}

const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { axiosInstance } = useAxios();

  return useMutation({
    mutationFn: async (payload: CreateEventPayload) => {
      const formData = new FormData();

      formData.append("title", payload.title);
      formData.append("description", payload.description);
      formData.append("address", payload.address);
      formData.append("price", `${payload.price}`);
      formData.append("availableSeats", `${payload.availableSeats}`);
      formData.append("thumbnnail", payload.thumbnnail!);
      formData.append("startDate", payload.startDate);
      formData.append("endDate", payload.endDate);
      formData.append("categoryId", `${payload.categoryId}`);
      formData.append("cityId", `${payload.cityId}`);
      formData.append("userId", `${payload.userId}`);

      const { data } = await axiosInstance.post(`/events`, formData);

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

export default useCreateEvent;
