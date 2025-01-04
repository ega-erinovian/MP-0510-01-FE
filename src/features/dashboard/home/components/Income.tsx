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
import { DollarSign, Loader2, TrendingUp } from "lucide-react";

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
    <div className="relative h-full bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-white/5 backdrop-blur-sm"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(147,51,234,0.3) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3 text-white">
            <DollarSign className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Income</h1>
          </div>

          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger className="w-36 bg-white/10 border-white/20 text-white hover:bg-purple-400/30 transition-colors">
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

        <div className="text-white">
          {isPending ? (
            <div className="py-8">
              <Loader2 />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tight">
                  + {useFormatValue(data ? data.income : 0)}
                </span>
                <TrendingUp className="text-green-300 h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-white/90">
                  Revenue
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-white/20 rounded-full">
                  {selectedTime === "day" ? "today" : selectedTime}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Income;
