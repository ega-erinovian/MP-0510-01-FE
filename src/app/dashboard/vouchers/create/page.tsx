import DashboardLayout from "@/components/DashboardLayout";
import CreateVoucherComponent from "@/features/dashboard/voucher/CreateVoucherPage";
import React from "react";

const CreateVoucher = () => {
  return (
    <DashboardLayout>
      <CreateVoucherComponent />
    </DashboardLayout>
  );
};

export default CreateVoucher;
