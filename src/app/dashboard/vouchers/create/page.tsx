import DashboardLayout from "@/components/DashboardLayout";
import CreateVoucherComponent from "@/features/dashboard/voucher/create-voucher";
import React from "react";

const CreateVoucher = () => {
  return (
    <DashboardLayout>
      <CreateVoucherComponent />
    </DashboardLayout>
  );
};

export default CreateVoucher;
