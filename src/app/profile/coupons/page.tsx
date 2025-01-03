"use client";

import CustomerAuthGuard from "@/components/hoc/AuthGuardCustomer";
import Navbar from "@/components/Navbar";
import CouponsComponent from "@/features/profile/CouponsComponent";

const Coupons = () => {
  return (
    <>
      <Navbar />
      <CouponsComponent />
    </>
  );
};

export default CustomerAuthGuard(Coupons);
