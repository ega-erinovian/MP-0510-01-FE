import React, { FC } from "react";
import EventCardSkeleton from "./EventCardSkeleton";

interface EventSkeletonProps {
  dataQty: number;
}

const EventSkeleton: FC<EventSkeletonProps> = ({ dataQty }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(dataQty)].map((_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default EventSkeleton;
