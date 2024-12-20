"use client";

import axios from "axios";
import { useState, useEffect } from "react";

const useGetCitiesByCountry = (country: string) => {
  const [data, setData] = useState<CityType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // In-memory cache
  const cache: { [key: string]: CityType[] } = {};

  useEffect(() => {
    if (!country) return; // If no country is selected, don't fetch data

    // Check if the data for the selected country is already in cache
    if (cache[country]) {
      setData(cache[country]); // Use cached data if available
      return; // Exit early if data is cached
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch cities from the API
        const { data } = await axios.get(
          "http://localhost:8000/cities/filter/country?country=" + country
        );
        setData(data);

        // Cache the fetched cities for the selected country
        cache[country] = data;
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]); // Optionally clear data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [country]); // Re-run the effect if the country changes

  return { data, isLoading };
};

export default useGetCitiesByCountry;
