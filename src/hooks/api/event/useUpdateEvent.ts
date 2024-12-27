import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface UpdateEventPayload {
  id: number;
  title?: string;
  description?: string;
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

  return useMutation({
    mutationFn: async (payload: UpdateEventPayload) => {
      const updateEventForm = new FormData();

      if (payload.title) updateEventForm.append("title", payload.title);
      if (payload.description)
        updateEventForm.append("description", payload.description);
      if (payload.price) updateEventForm.append("price", `${payload.price}`);
      if (payload.availableSeats)
        updateEventForm.append("availableSeats", `${payload.availableSeats}`);
      if (payload.thumbnnail) {
        updateEventForm.append("thumbnnail", payload.thumbnnail);
      }
      if (payload.startDate)
        updateEventForm.append("startDate", payload.startDate);
      if (payload.endDate) updateEventForm.append("endDate", payload.endDate);
      if (payload.categoryId)
        updateEventForm.append("categoryId", `${payload.categoryId}`);
      if (payload.cityId) updateEventForm.append("cityId", `${payload.cityId}`);

      const { data } = await axiosInstance.patch(
        `/events/${payload.id}`,
        updateEventForm
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event Updated Successfullly");
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
