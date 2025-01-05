"use client";

import CustomerAuthGuard from "@/components/hoc/AuthGuardCustomer";
import Navbar from "@/components/Navbar";
import ReferralComponent from "@/features/profile/ReferralComponent";
import React from "react";

const ReferralHistory = () => {
  return (
    <>
      <Navbar />
      <ReferralComponent />
    </>
  );
};

export default CustomerAuthGuard(ReferralHistory);
