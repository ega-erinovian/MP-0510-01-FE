"use client";

import CustomerAuthGuard from "@/components/hoc/AuthGuardCustomer";
import LandingPageLayout from "@/components/LandingPageLayout";
import UpdateProfileComponent from "@/features/profile/EditUserComponent";

const EditProfile = ({ params }: { params: { id: string } }) => {
  return (
    <LandingPageLayout>
      <UpdateProfileComponent id={parseInt(params.id)} />
    </LandingPageLayout>
  );
};

export default CustomerAuthGuard(EditProfile);
