"use client";

import useGetEvents from "@/hooks/event/useGetEvents";
import EventTable from "./components/EventTable";

const EventList = () => {
  const { data, isLoading } = useGetEvents();

  return (
    <div className="mx-auto p-8">
      <h1 className="text-9xl mb-8 font-bold">Event List</h1>
      <EventTable data={data} isLoading={isLoading} />
    </div>
  );
};

export default EventList;
