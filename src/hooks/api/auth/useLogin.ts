"use client";

import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react"; // Hanya bisa digunakan di client side comp

// Use React Query
interface LoginPayload {
  email: string;
  password: string;
}

const useLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await axiosInstance.post("/auth/login", payload);
      return data;
    },
    onSuccess: async (data) => {
      toast.success(`Welcome, ${data.fullName}!`);

      await signIn("credentials", { ...data, redirect: false });

      if (data.role === "ORGANIZER") {
        router.replace("/dashboard/events");
      } else if (data.role === "CUSTOMER") {
        router.replace("/");
      }
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useLogin;
