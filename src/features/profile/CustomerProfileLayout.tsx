"use client";

import React, { ReactNode } from "react";
import ProfileSidebar from "./components/ProfileSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import CustomerAuthGuard from "@/components/hoc/AuthGuardCustomer";

interface CustomerProfileLayoutProps {
  children: ReactNode;
}

const CustomerProfileLayout: React.FC<CustomerProfileLayoutProps> = ({
  children,
}) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col lg:flex-row bg-background w-full">
        <div className="w-full lg:w-64 flex-shrink-0">
          <ProfileSidebar />
        </div>
        <main className="flex-1 p-4 lg:p-6 mt-16 lg:mt-20">
          <div className="fixed bottom-4 right-4 text-xl rounded-full bg-purple-700 text-white shadow-md">
            <SidebarTrigger className="rounded-full hover:bg-purple-900 " />
          </div>
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CustomerAuthGuard(CustomerProfileLayout);
