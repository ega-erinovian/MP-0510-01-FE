"use client";

import DashboardLayout from "@/components/DashboardLayout";
import OrganizerAuthGuard from "@/components/hoc/AuthGuardOrganizer";
import dynamic from "next/dynamic";

const CreateEventComponent = dynamic(
  () => import("@/features/dashboard/event/CreateEventComponent"),
  { ssr: false }
);

const CreateEvent = () => {
  return (
    <DashboardLayout>
      <CreateEventComponent />
    </DashboardLayout>
  );
};

export default OrganizerAuthGuard(CreateEvent);
