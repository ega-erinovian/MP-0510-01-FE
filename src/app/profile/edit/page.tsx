"use client";

import CustomerAuthGuard from "@/components/hoc/AuthGuardCustomer";
import Navbar from "@/components/Navbar";
import UpdateProfileComponent from "@/features/profile/EditUserComponent";

const EditProfile = () => {
  return (
    <>
      <Navbar />
      <UpdateProfileComponent />
    </>
  );
};

export default CustomerAuthGuard(EditProfile);
