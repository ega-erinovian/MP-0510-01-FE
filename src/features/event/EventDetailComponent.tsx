"use client";

import DataNotFound from "@/components/dashboard/DataNotFound";
import Loading from "@/components/dashboard/Loading";
import Markdown from "@/components/Markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useGetEvent from "@/hooks/api/event/useGetEvent";
import { Calendar, Clock, Flag, LocateIcon, Share2 } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

interface EventDetailComponentProps {
  id: number;
}

const EventDetailComponent: FC<EventDetailComponentProps> = ({ id }) => {
  const { data: event, isLoading: isEventLoading } = useGetEvent(id);

  if (isEventLoading) <Loading text="Event Data" />;

  if (!event) {
    return <DataNotFound text="Event not found" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Banner Image */}
          <div className="relative h-[480px] w-full overflow-hidden rounded-lg">
            <Image
              src={event.thumbnnail}
              alt="thumbnail"
              fill
              className="object-cover duration-100 hover:scale-105"
            />
          </div>

          {/* Event Title & Actions */}
          <div className="my-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {new Intl.DateTimeFormat("en-ID", {
                    dateStyle: "full",
                    timeStyle: "short",
                    timeZone: "Asia/Jakarta",
                  }).format(new Date(event.startDate))}
                </p>
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Organizer */}
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src="https://res.cloudinary.com/dpeljv2vu/image/upload/v1735294682/ftlh4vmowuyfx3wdqymu.jpg"
                  alt="profile-picture"
                  className="object-cover"
                />
                <AvatarFallback>{event.organizer.fullName}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  By{" "}
                  <span className="font-semibold">
                    {event.organizer.fullName}
                  </span>
                </p>
                {/* <p className="text-xs text-muted-foreground">12.2k followers</p> */}
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Visit Profile
              </Button>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-8">
            {/* Date and Location */}
            <Card>
              <CardHeader className="pb-4">
                <h2 className="text-xl font-semibold">Date and time</h2>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="flex items-center gap-4">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {new Intl.DateTimeFormat("en-ID", {
                        dateStyle: "full",
                        timeStyle: "short",
                        timeZone: "Asia/Jakarta",
                      }).format(new Date(event.startDate))}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <LocateIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {event.address}, {event.city.name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader className="pb-3">
                <h2 className="text-xl font-semibold">About this event</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <Markdown content={event.description} />

                {/* Tags */}
                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{event.category.name}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {event.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}{" "}
                  / pax
                </p>
              </div>

              <Button className="w-full" size="lg">
                Reserve a spot
              </Button>

              <div className="mt-6 pt-6 border-t">
                <Button variant="outline" className="w-full" size="lg">
                  <Flag className="mr-2 h-4 w-4" />
                  Report this event
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetailComponent;
