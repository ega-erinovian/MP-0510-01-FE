import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EventType } from "@/types/event";
import Image from "next/image";
import { FC } from "react";

interface EventCardProps {
  event: EventType;
}

const EventCard: FC<EventCardProps> = ({ event }) => {
  return (
    <Card className="group relative h-full pb-14 sm:pb-16 hover:shadow-xl transition-all duration-300 border-zinc-200">
      <div className="relative w-full h-[180px] sm:h-[200px] overflow-hidden">
        <Image
          src={event.thumbnnail}
          alt={`${event.title} thumbnail`}
          fill
          className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100%, (max-width: 768px) 50%, 25%"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-md bg-purple-100 text-purple-700 px-2.5 py-1 text-xs font-medium hover:bg-purple-200 transition-colors">
            {event.category.name}
          </Badge>
        </div>

        <div className="space-y-2">
          <h2 className="line-clamp-2 text-base sm:text-lg font-bold leading-tight">
            {event.title}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            {new Intl.DateTimeFormat("en-ID", {
              dateStyle: "full",
              timeStyle: "short",
              timeZone: "Asia/Jakarta",
            }).format(new Date(event.startDate))}
          </p>
          <p className="text-xs sm:text-sm text-zinc-600 line-clamp-1">
            {event.address}, {event.city.name}
          </p>
          <p className="font-semibold text-sm sm:text-base">
            {event.price > 0
              ? event.price.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })
              : "Free"}
          </p>
        </div>
      </CardContent>

      <div className="absolute bottom-4 left-6 right-6">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6 border border-zinc-200">
            <AvatarImage
              src={event.organizer.profilePicture ?? ""}
              alt={event.organizer.fullName}
              className="object-cover"
            />
            <AvatarFallback className="text-xs bg-purple-100 text-purple-700">
              {event.organizer.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs text-zinc-700 font-medium">
              {event.organizer.fullName}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
