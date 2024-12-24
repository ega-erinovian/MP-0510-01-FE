import { axiosInstance } from "@/lib/axios";
import { UserType } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

const useGetUser = (id: number) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<UserType>(`/users/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 0,
  });
};

export default useGetUser;
