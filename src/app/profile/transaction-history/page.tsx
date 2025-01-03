"use client";

import CustomerAuthGuard from "@/components/hoc/AuthGuardCustomer";
import Navbar from "@/components/Navbar";
import TransactionHistoryComponent from "@/features/profile/TransactionHistoryComponent";
import React from "react";

const TransactionHistory = () => {
  return (
    <>
      <Navbar />
      <TransactionHistoryComponent />
    </>
  );
};

export default CustomerAuthGuard(TransactionHistory);
