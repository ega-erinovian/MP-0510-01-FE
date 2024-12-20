"use client";

import axios from "axios";
import { useState, useEffect } from "react";

const useGetCountries = () => {
  const [data, setData] = useState<CountryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get("http://localhost:8000/countries");
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading };
};

export default useGetCountries;
