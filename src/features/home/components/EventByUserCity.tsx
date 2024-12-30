"use client";

import DataNotFound from "@/components/dashboard/DataNotFound";
import Loading from "@/components/dashboard/Loading";
import PaginationSection from "@/components/dashboard/PaginationSection";
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
    cityId: user?.cityId || 2,
  });

  const onChangePage = (page: number) => {
    setPage(String(page));
  };

  return (
    <div className="mb-4">
      <h1 className="text-9xl tracking-tighter mb-8">
        Events In {user ? "Your City" : "Yogyakarta"}
      </h1>
      {events && events.data.length <= 0 && (
        <DataNotFound text="Data Not Found" />
      )}
      <div className="grid gap-4 md:grid-cols-4">
        {isPending ? (
          <Loading text="Events" />
        ) : (
          events?.data.map((event) => {
            return (
              <Link href={`/events/${event.id}`} key={event.id}>
                <EventCard event={event} />
              </Link>
            );
          })
        )}
      </div>
      {events && (
        <div className="w-full flex justify-end items-center">
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
