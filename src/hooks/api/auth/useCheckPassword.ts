import useAxios from "@/hooks/useAxios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface CheckPasswordPayload {
  id: number;
  password: string;
}

const useCheckPassword = () => {
  const { axiosInstance } = useAxios();

  return useMutation({
    mutationFn: async (payload: CheckPasswordPayload) => {
      const { data } = await axiosInstance.post(
        "/auth/check-password",
        payload
      );
      return data;
    },
    onSuccess: () => {
      console.log("password valid");
    },
    onError: (error: AxiosError<any>) => {
      console.log(error.response?.data);
    },
  });
};

export default useCheckPassword;
