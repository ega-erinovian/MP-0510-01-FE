"use client";

import Loading from "@/components/dashboard/Loading";
import useGetTransactionsIncomePerMonth from "@/hooks/api/transaction/useGetTransactionsIncomePerMonth";
import { FC } from "react";
import SalesChart from "./SalesChart";
import { Loader2 } from "lucide-react";
import DataNotFound from "@/components/dashboard/DataNotFound";

interface SalesRevenueProps {
  id: number;
}

const SalesRevenue: FC<SalesRevenueProps> = ({ id }) => {
  const { data, isPending } = useGetTransactionsIncomePerMonth({
    userId: id,
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 relative h-full col-span-2 row-span-3 row-start-2">
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center">
          <div className="w-1 h-8 bg-purple-600 rounded-full mr-3"></div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            Sales Revenue
          </h1>
        </div>
        <div className="h-6 border-l border-gray-300"></div>
        <p className="text-gray-600 font-medium">{new Date().getFullYear()}</p>
      </div>
      {isPending ? (
        <Loading text="Chart" />
      ) : data ? (
        <SalesChart monthlyChart={data.income} />
      ) : (
        <DataNotFound text="No data found" />
      )}
    </div>
  );
};

export default SalesRevenue;
