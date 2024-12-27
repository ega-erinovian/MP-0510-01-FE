import { axiosInstance } from "@/lib/axios";
import { EventType } from "@/types/event";
import { useQuery } from "@tanstack/react-query";

const useGetEvent = (id: number) => {
  return useQuery({
    queryKey: ["events", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<EventType>(`/events/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 0,
  });
};

export default useGetEvent;
