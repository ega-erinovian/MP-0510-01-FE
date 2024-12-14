import DashboardLayout from "@/components/DashboardLayout";
import EditVoucherPage from "@/features/dashboard/voucher/EditVoucherPage";
import React from "react";

// Add params prop with type
interface PageProps {
  params: {
    id: string;
  };
}

const EditVoucher = ({ params }: PageProps) => {
  return (
    <DashboardLayout>
      <EditVoucherPage id={params.id} />
    </DashboardLayout>
  );
};

export default EditVoucher;
