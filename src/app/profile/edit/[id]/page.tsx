"use client";

import CustomerAuthGuard from "@/components/hoc/AuthGuardCustomer";
import Navbar from "@/components/Navbar";
import UpdateProfileComponent from "@/features/profile/EditUserComponent";

const EditProfile = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <Navbar />
      <UpdateProfileComponent id={parseInt(params.id)} />
    </>
  );
};

export default CustomerAuthGuard(EditProfile);
