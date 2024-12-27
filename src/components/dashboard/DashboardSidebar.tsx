"use client";

import {
  Calendar,
  ChevronRight,
  Layout,
  LogOut,
  Ticket,
  TicketPercent,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import useGetUser from "@/hooks/api/user/useGetUser";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

// Menu items.
const items = [
  {
    title: "Events",
    icon: Calendar,
    subitems: [
      {
        title: "Event List",
        url: "/dashboard/events",
      },
    ],
  },
  {
    title: "Transactions",
    icon: Ticket,
    subitems: [
      {
        title: "Transaction List",
        url: "/dashboard/transactions",
      },
    ],
  },
  {
    title: "Voucher",
    icon: TicketPercent,
    subitems: [
      {
        title: "Voucher List",
        url: "/dashboard/vouchers",
      },
      {
        title: "Create Voucher",
        url: "/dashboard/vouchers/create-voucher",
      },
    ],
  },
];

const DashboardSidebar = () => {
  const pathname = usePathname();

  const { data } = useSession(); // dari next-auth

  const { data: user } = useGetUser(data?.user.id!);

  const logout = () => {
    // Logout pakai next-auth
    signOut();
  };

  return (
    <Sidebar>
      <SidebarContent className="pt-4 ps-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl mb-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-bold">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-600 text-primary-foreground">
                <Ticket className="size-4" color="#fafafa" />
              </div>
              EventIn.
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="mb-2">
                <SidebarMenuButton
                  asChild
                  className={
                    pathname === "/dashboard/"
                      ? "bg-[#e8e9ea] hover:bg-[#d6d7d9]"
                      : "hover:bg-[#e8e9ea]"
                  }>
                  <Link href="/dashboard/">
                    <Layout />
                    <span className="font-semibold">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {items.map((item, idx) => (
                <Collapsible
                  defaultOpen
                  className="group/collapsible"
                  key={idx}>
                  <SidebarMenuItem className="mb-2">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="font-semibold">
                        <>
                          <item.icon />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subitems.map((subitem, idx) => (
                          <SidebarMenuSubItem key={idx}>
                            <Link href={subitem.url}>
                              <SidebarMenuButton
                                className={
                                  pathname && pathname === subitem.url
                                    ? "bg-[#e8e9ea] hover:bg-[#d6d7d9]"
                                    : "hover:bg-[#e8e9ea]"
                                }>
                                <span>{subitem.title}</span>
                              </SidebarMenuButton>
                            </Link>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {!!user?.id && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem className="mb-2">
              <Link href={`/dashboard/profile/edit/${user.id}`}>
                <SidebarMenuButton asChild className="h-full">
                  <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 ">
                      <Image
                        src={`${
                          user.profilePicture ??
                          "https://res.cloudinary.com/dpeljv2vu/image/upload/v1734840028/blank-profile-picture-973460_640_enmtle.webp"
                        }`}
                        alt="world-map"
                        className="object-cover rounded-full"
                        fill
                      />
                    </div>
                    <span className="font-bold">{`${user.fullName}`}</span>
                  </div>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem className="mb-2">
              <SidebarMenuButton asChild className="font-semibold">
                <Button
                  onClick={logout}
                  variant={"ghost"}
                  className="flex items-center justify-start">
                  <LogOut />
                  <span>Logout</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default DashboardSidebar;
