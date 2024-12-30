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
    <Card className="relative h-full pb-12 hover:shadow-lg transition-all hover:scale-105">
      <div className="relative w-full h-[200px]">
        <Image
          src={event.thumbnnail}
          alt="thumbnail"
          fill
          className="object-cover rounded-lg rounded-b-none"
        />
      </div>
      <CardContent className="pt-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge
            variant="outline"
            className="rounded-sm bg-purple-100 text-purple-700">
            {event.category.name}
          </Badge>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="line-clamp-2 text-lg font-bold">{event.title}</h2>
          <p className="text-sm">
            {new Intl.DateTimeFormat("en-ID", {
              dateStyle: "full",
              timeStyle: "short",
              timeZone: "Asia/Jakarta",
            }).format(new Date(event.startDate))}
          </p>
          <p className="text-sm">
            {event.address}, {event.city.name}
          </p>
          <p className="font-semibold">
            {event.price > 0
              ? event.price.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })
              : "Free"}
          </p>
        </div>
      </CardContent>
      <p className="absolute bottom-4 left-6">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage
              src={event.organizer.profilePicture ?? ""}
              alt={event.organizer.fullName}
              className="object-cover"
            />
            <AvatarFallback>
              {event.organizer.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs">{event.organizer.fullName}</span>
          </div>
        </div>
      </p>
    </Card>
  );
};

export default EventCard;
