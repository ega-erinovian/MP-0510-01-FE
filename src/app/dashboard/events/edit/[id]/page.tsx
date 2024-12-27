import DashboardLayout from "@/components/DashboardLayout";
import EditEventComponent from "@/features/dashboard/event/EditEventComponent";
import React from "react";

const EditEvent = ({ params }: { params: { id: string } }) => {
  return (
    <DashboardLayout>
      <EditEventComponent id={parseInt(params.id)} />
    </DashboardLayout>
  );
};

export default EditEvent;
