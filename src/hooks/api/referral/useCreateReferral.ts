import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface CreateReferralPayload {
  referrerUserId: number;
  refereeUserId: number;
}

const useCreateReferral = () => {
  return useMutation({
    mutationFn: async (payload: CreateReferralPayload) => {
      const { data } = await axiosInstance.post("/referrals", payload);
      return data;
    },
    onSuccess: () => {
      console.log("Referral History Created Successfullly");
    },
    onError: (error: AxiosError<any>) => {
      console.log(error.response?.data);
    },
  });
};

export default useCreateReferral;
