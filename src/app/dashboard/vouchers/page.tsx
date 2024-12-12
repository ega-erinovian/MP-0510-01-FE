import DashboardLayout from "@/components/DashboardLayout";
import VouchersList from "@/features/dashboard/voucher/vouchers-list";
import React from "react";

const Vouchers = () => {
  return (
    <DashboardLayout>
      <VouchersList />
    </DashboardLayout>
  );
};

export default Vouchers;
