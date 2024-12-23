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
import { useSession } from "next-auth/react";
import React, { FC, useState } from "react";

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
    <div className="bg-gray-200 rounded-md p-8 relative h-full">
      <div>
        <h1 className="text-3xl font-bold">Sales</h1>
        {isPending ? (
          <Loading text="" />
        ) : (
          <p className="text-7xl pt-4 pb-2">{data.qty}</p>
        )}
        <p className="text-lg">Tickets Sold</p>
      </div>
      <div className="absolute top-8 right-8">
        <Select value={selectedTime} onValueChange={setselectedTime}>
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

export default TicketsSold;
