"use client";

import { FC } from "react";
import RecentSalesItem from "./RecentSaleItem";
import useGetTransactions from "@/hooks/api/transaction/useGetTransactions";
import Loading from "@/components/dashboard/Loading";

interface RecentSalesProps {
  id: number;
}

const RecentSales: FC<RecentSalesProps> = ({ id }) => {
  const { data: transactions, isPending } = useGetTransactions({
    page: 1,
    sortBy: "createdAt",
    sortOrder: "desc",
    take: 5,
    userId: id,
    status: "DONE",
  });
  return (
    <div className="bg-gray-100 row-span-3 col-start-3 row-start-2 rounded-md p-8 relative h-full ">
      <h1 className="text-3xl font-bold mb-4">Recent Sales</h1>
      {isPending ? (
        <Loading text="" />
      ) : (
        transactions?.data.map((transaction) => (
          <RecentSalesItem
            id={transaction.id}
            title={transaction.event.title}
            createdAt={transaction.createdAt}
          />
        ))
      )}
    </div>
  );
};

export default RecentSales;
