"use client";

import useGetVouchers from "@/hooks/api/vouchers/useGetVouchers";
import VoucherTable from "./components/VoucherTable";

const VouchersList = () => {
  const { data, isLoading } = useGetVouchers();
  return (
    <div className="mx-auto p-8">
      <h1 className="text-9xl mb-8 font-bold">Vouchers List</h1>
      <VoucherTable data={data} isLoading={isLoading} />
    </div>
  );
};

export default VouchersList;
