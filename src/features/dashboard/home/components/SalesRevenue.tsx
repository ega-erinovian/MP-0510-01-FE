"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SalesChart from "./SalesChart";
import { FC, useState } from "react";
import useGetTransactionsIncomePerMonth from "@/hooks/api/transaction/useGetTransactionsIncomePerMonth";
import Loading from "@/components/dashboard/Loading";

interface SalesRevenueProps {
  id: number;
}

const SalesRevenue: FC<SalesRevenueProps> = ({ id }) => {
  // const [selectedYear, setSelectedYear] = useState("2024");

  const { data, isPending } = useGetTransactionsIncomePerMonth({
    userId: id,
  });

  return (
    <div className="bg-gray-100 rounded-md p-8 relative h-full col-span-2 row-span-3 row-start-2">
      <div className="flex gap-4 items-center">
        <h1 className="text-3xl font-bold">Sales Revenue</h1>{" "}
        <div className="border-l h-6 border-gray-500"></div>
        <p>{new Date().getFullYear()}</p>
        {/* <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[90px] text-black shadow-none border-none">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent className="max-h-[150px]">
            <SelectGroup>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select> */}
      </div>
      {isPending ? (
        <Loading text="" />
      ) : (
        <SalesChart monthlyChart={data.income} />
      )}
    </div>
  );
};

export default SalesRevenue;
