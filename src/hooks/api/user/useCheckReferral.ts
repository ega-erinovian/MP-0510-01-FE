import { axiosInstance } from "@/lib/axios";
import { UserType } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

const useCheckReferral = (referralCode: string) => {
  return useQuery({
    queryKey: ["users", referralCode],
    queryFn: async () => {
      const { data } = await axiosInstance.get<UserType>("/users", {
        params: { referralCode },
      });

      return data;
    },
  });
};

export default useCheckReferral;
