"use client";

import { OrganizerSidebar } from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="dashboard-layout flex h-screen">
      <SidebarProvider>
        <OrganizerSidebar />
        <main className="flex-1 h-full overflow-auto">{children}</main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
