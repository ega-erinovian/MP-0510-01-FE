"use client";

import DashboardLayout from "@/components/DashboardLayout";
import OrganizerAuthGuard from "@/components/hoc/AuthGuardOrganizer";
import UpdatePasswordComponent from "@/features/dashboard/profile/UpdatePasswordComponent";
import { useSession } from "next-auth/react";

const UpdatePassword = () => {
  const { data } = useSession();

  return (
    <DashboardLayout>
      <UpdatePasswordComponent id={data?.user.id || 0} />
    </DashboardLayout>
  );
};

export default OrganizerAuthGuard(UpdatePassword);
