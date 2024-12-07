import DashboardLayout from "@/components/DashboardLayout";
import EventList from "@/features/dashboard/event/event-list";

const EventPage = () => {
  return (
    <DashboardLayout>
      <EventList />
    </DashboardLayout>
  );
};

export default EventPage;
