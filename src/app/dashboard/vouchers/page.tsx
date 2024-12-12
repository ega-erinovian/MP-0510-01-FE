import DashboardLayout from "@/components/DashboardLayout";
import VouchersList from "@/features/dashboard/voucher";
import React from "react";

const Vouchers = () => {
  return (
    <DashboardLayout>
      <VouchersList />
    </DashboardLayout>
  );
};

export default Vouchers;
