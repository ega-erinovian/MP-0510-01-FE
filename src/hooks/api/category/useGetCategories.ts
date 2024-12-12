import { axiosInstance } from "@/lib/axios";
import { CategoryType } from "@/types/category";
import { useQuery } from "@tanstack/react-query";

const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/categories");
      return data;
    },
  });
};

export default useGetCategories;
