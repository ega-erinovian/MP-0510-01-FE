"use client";

import CustomerAuthGuard from "@/components/hoc/AuthGuardCustomer";
import Navbar from "@/components/Navbar";
import UpdatePasswordComponent from "@/features/profile/UpdatePasswordComponent";
import { useSession } from "next-auth/react";
import React from "react";

const UpdatePassword = () => {
  const { data } = useSession();

  return (
    <>
      <Navbar />
      <UpdatePasswordComponent id={data?.user.id || 0} />
    </>
  );
};

export default CustomerAuthGuard(UpdatePassword);
