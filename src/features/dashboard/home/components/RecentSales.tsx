"use client";

import { FC } from "react";
import RecentSalesItem from "./RecentSaleItem";
import useGetTransactions from "@/hooks/api/transaction/useGetTransactions";
import Loading from "@/components/dashboard/Loading";
import { Receipt } from "lucide-react";

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
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border border-gray-100 p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex justify-center items-center shadow-sm">
          <Receipt className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recent Sales</h1>
          <p className="text-sm text-gray-500">Latest transactions</p>
        </div>
      </div>

      <div className="space-y-1">
        {isPending ? (
          <div className="flex justify-center items-center h-48">
            <Loading text="" />
          </div>
        ) : transactions?.data.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No recent transactions found
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {transactions?.data.map((transaction) => (
              <RecentSalesItem
                key={transaction.id}
                id={transaction.id}
                title={transaction.event.title}
                createdAt={transaction.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentSales;
