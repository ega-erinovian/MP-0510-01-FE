"use client";

import DataNotFound from "@/components/dashboard/DataNotFound";
import PaginationSection from "@/components/dashboard/PaginationSection";
import EventSkeleton from "@/components/skeletons/EventSkeleton";
import useGetEvents from "@/hooks/api/event/useGetEvents";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import EventCard from "./EventCard";

const EventByUserCity = () => {
  const { data } = useSession();
  const user = data?.user;

  const [page, setPage] = useQueryState("page", { defaultValue: "1" });

  const { data: events, isPending } = useGetEvents({
    page: Number(page),
    sortBy: "createdAt",
    sortOrder: "desc",
    take: 4,
    cityId: user?.cityId ?? 2,
  });

  const onChangePage = (page: number) => {
    setPage(String(page));
  };

  return (
    <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-20">
      <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl tracking-tighter mb-4 sm:mb-6 md:mb-8 font-bold">
        Events In Your City
      </h1>
      {isPending && <EventSkeleton dataQty={4} />}
      {events && events.data.length <= 0 && !isPending && (
        <DataNotFound text="Event Not Found" />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {events &&
          events.data.map((event) => {
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
      {events && events.data.length > 0 && (
        <div className="w-full flex justify-end items-center mt-4 sm:mt-6">
          <PaginationSection
            onChangePage={onChangePage}
            page={Number(page)}
            take={events.meta.take || 4}
            total={events.meta.total}
          />
        </div>
      )}
    </div>
  );
};

export default EventByUserCity;
