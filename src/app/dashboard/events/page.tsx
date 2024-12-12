import DashboardLayout from "@/components/DashboardLayout";
import EventList from "@/features/dashboard/event/event-list";
import React from "react";

const Events = () => {
  return (
    <DashboardLayout>
      <EventList />
    </DashboardLayout>
  );
};

export default Events;
