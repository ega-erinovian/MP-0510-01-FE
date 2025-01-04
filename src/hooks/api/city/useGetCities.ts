import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface GetCitiesQuery {
  countryId?: number;
  search?: string;
}

const useGetCities = (queries: GetCitiesQuery) => {
  return useQuery({
    queryKey: ["cities", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<CityType[]>("/cities", {
        params: queries,
      });

      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export default useGetCities;
