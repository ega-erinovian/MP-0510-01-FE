import { axiosInstance } from "@/lib/axios";
import { EventType } from "@/types/event";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

interface GetEventsQuery extends PaginationQueries {
  search?: string;
  categoryId?: number;
}

const useGetEvents = (queries: GetEventsQuery) => {
  return useQuery({
    queryKey: ["events", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<EventType>>(
        "/events",
        { params: queries }
      );

      return data;
    },
  });
};

export default useGetEvents;
