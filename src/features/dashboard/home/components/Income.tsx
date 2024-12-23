"use client";

import Loading from "@/components/dashboard/Loading";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetTransactionsIncome from "@/hooks/api/transaction/useGetTransactionsIncome";
import { useFormatValue } from "@/hooks/use-format-value";
import { FC, useState } from "react";

interface IncomeProps {
  id: number;
}

const Income: FC<IncomeProps> = ({ id }) => {
  const [selectedTime, setSelectedTime] = useState("day");

  const { data, isPending } = useGetTransactionsIncome({
    timeFilter: selectedTime,
    userId: id,
  });

  return (
    <div className="bg-gray-200 rounded-md p-8 relative h-full">
      <div>
        <h1 className="text-3xl font-bold">Income</h1>
        {isPending ? (
          <Loading text="" />
        ) : (
          <p className="text-6xl pt-4 pb-4">+ {useFormatValue(data.income)}</p>
        )}
        <p className="text-lg">Revenue</p>
      </div>
      <div className="absolute top-8 right-8">
        <Select value={selectedTime} onValueChange={setSelectedTime}>
          <SelectTrigger className="w-[180px] bg-slate-400 text-white">
            <SelectValue placeholder="Select Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Income;
