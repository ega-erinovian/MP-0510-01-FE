"use client";

import DataNotFound from "@/components/dashboard/DataNotFound";
import EventSkeleton from "@/components/skeletons/EventSkeleton";
import useGetEvents from "@/hooks/api/event/useGetEvents";
import Link from "next/link";
import EventCard from "./EventCard";

const NewestEvent = () => {
  const { data: events, isPending } = useGetEvents({
    page: 1,
    sortBy: "createdAt",
    sortOrder: "desc",
    take: 4,
  });

  return (
    <div className="mb-8 sm:mb-12 md:mb-20 lg:mb-28">
      <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl tracking-tighter font-bold mb-4 sm:mb-6 md:mb-8">
        Newest Events
      </h1>
      {isPending && <EventSkeleton dataQty={4} />}
      {events && events.data.length <= 0 && !isPending && (
        <DataNotFound text="Event Not Found" />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {events?.data.map((event) => {
          return (
            <Link
              href={`/events/${event.id}`}
              key={event.id}
              className="transition-transform hover:scale-105 duration-200">
              <EventCard event={event} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NewestEvent;
