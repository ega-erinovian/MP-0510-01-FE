"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";
import DashboardSidebar from "./dashboard/DashboardSidebar";
import AuthGuard from "./hoc/AuthGuardOrganizer";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="dashboard-layout flex h-screen">
      <SidebarProvider>
        <DashboardSidebar />
        <main className="flex-1 h-full overflow-auto">{children}</main>
      </SidebarProvider>
    </div>
  );
};

export default AuthGuard(DashboardLayout);
