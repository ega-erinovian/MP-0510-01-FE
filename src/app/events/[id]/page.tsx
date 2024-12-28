import LandingPageLayout from "@/components/LandingPageLayout";
import EventDetailComponent from "@/features/event/EventDetailComponent";
import React from "react";

const EventDetail = ({ params }: { params: { id: string } }) => {
  return (
    <LandingPageLayout>
      <EventDetailComponent id={Number(params.id)} />
    </LandingPageLayout>
  );
};

export default EventDetail;
