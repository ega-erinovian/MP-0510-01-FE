"use client";

import axios from "axios";
import { useState, useEffect } from "react";

const useGetVouchers = () => {
  const [data, setData] = useState<VoucherType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get("http://localhost:8000/vouchers");
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

export default useGetVouchers;
