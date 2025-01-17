"use client";

import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface GetCountriesQuery {
  cityId?: number;
}

const useGetCountries = (queries?: GetCountriesQuery) => {
  return useQuery({
    queryKey: ["countries", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<CountryType[]>("/countries", {
        params: queries,
      });

      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export default useGetCountries;
