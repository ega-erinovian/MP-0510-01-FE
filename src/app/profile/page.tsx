"use client";

import CustomerAuthGuard from "@/components/hoc/AuthGuardCustomer";
import LandingPageLayout from "@/components/LandingPageLayout";
import TransactionHistoryComponent from "@/features/profile/TransactionHistoryComponent";
import React from "react";

const CustomerProfile = () => {
  return (
    <LandingPageLayout>
      <TransactionHistoryComponent />
    </LandingPageLayout>
  );
};

export default CustomerAuthGuard(CustomerProfile);
