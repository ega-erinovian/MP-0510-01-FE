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
import useGetTransactionsQty from "@/hooks/api/transaction/useGetTransactionsQty";
import { Loader2, Ticket } from "lucide-react";
import { FC, useState } from "react";

interface TicketsSoldProps {
  id: number;
}

const TicketsSold: FC<TicketsSoldProps> = ({ id }) => {
  const [selectedTime, setselectedTime] = useState("day");

  const { data, isPending } = useGetTransactionsQty({
    timeFilter: selectedTime,
    userId: id,
  });

  return (
    <div className="relative h-full bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-white/5 backdrop-blur-sm"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(147,51,234,0.3) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Content Container */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3 text-white">
            <Ticket className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Sales</h1>
          </div>

          {/* Time Select */}
          <Select value={selectedTime} onValueChange={setselectedTime}>
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

        {/* Ticket Count */}
        <div className="text-white">
          {isPending ? (
            <div className="py-8">
              <Loader2 />
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-6xl font-bold tracking-tight">
                {data ? data.qty : 0}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-white/90">
                  Tickets Sold
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-white/20 rounded-full">
                  {selectedTime}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketsSold;
