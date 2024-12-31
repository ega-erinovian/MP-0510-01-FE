"use client";

import Loading from "@/components/dashboard/Loading";
import useGetEvents from "@/hooks/api/event/useGetEvents";
import Link from "next/link";
import { useState } from "react";
import EventCard from "./EventCard";

const NewestEvent = () => {
  const [page, setPage] = useState<number>(1);
  const [take, setTake] = useState<number>(4);

  const { data: events, isPending } = useGetEvents({
    page,
    sortBy: "createdAt",
    sortOrder: "desc",
    take,
  });

  return (
    <div className="mb-28">
      <h1 className="text-9xl tracking-tighter">Newest Events</h1>
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
    </div>
  );
};

export default NewestEvent;