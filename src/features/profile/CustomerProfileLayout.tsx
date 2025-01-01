"use client";

import React, { ReactNode } from "react";
import ProfileSidebar from "./components/ProfileSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import CustomerAuthGuard from "@/components/hoc/AuthGuardCustomer";

interface LandingPageLayoutProps {
  children: ReactNode;
}

const CustomerProfileLayout: React.FC<LandingPageLayoutProps> = ({
  children,
}) => {
  return (
    <SidebarProvider>
      <ProfileSidebar />
      <main className="mt-16 w-full">{children}</main>
    </SidebarProvider>
  );
};

export default CustomerAuthGuard(CustomerProfileLayout);
