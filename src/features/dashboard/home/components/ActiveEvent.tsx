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
import useGetEvents from "@/hooks/api/event/useGetEvents";
import { FC, useState } from "react";

interface ActiveEventProps {
  id: number;
}

const ActiveEvent: FC<ActiveEventProps> = ({ id }) => {
  const [selectedTime, setSelectedTime] = useState("week");

  const { data: events, isPending } = useGetEvents({
    page: 1,
    sortBy: "id",
    sortOrder: "desc",
    take: -1,
    userId: id,
  });

  return (
    <div className="bg-gray-200 rounded-md p-8 relative h-full">
      <div>
        <h1 className="text-3xl font-bold">Events</h1>
        {isPending ? (
          <Loading text="" />
        ) : (
          <p className="text-7xl pt-4 pb-2">{events?.meta.total}</p>
        )}
        <p className="text-lg">Active Events</p>
      </div>
      <div className="absolute top-8 right-8">
        <Select value={selectedTime} onValueChange={setSelectedTime}>
          <SelectTrigger className="w-[180px] bg-slate-400 text-white">
            <SelectValue placeholder="Select Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="day">Day</SelectItem>
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

export default ActiveEvent;
