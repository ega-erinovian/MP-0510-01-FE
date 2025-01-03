"use client";

import {
  Calendar,
  ChevronRight,
  Home,
  Layout,
  LogOut,
  Settings,
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
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const items = [
  {
    title: "Events",
    icon: Calendar,
    subitems: [
      {
        title: "Event List",
        url: "/dashboard/events",
      },
      {
        title: "Create Event",
        url: "/dashboard/events/create",
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
        url: "/dashboard/vouchers/create",
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    subitems: [
      {
        title: "Reset Password",
        url: "/dashboard/profile/update-password",
      },
    ],
  },
];

const DashboardSidebar = () => {
  const pathname = usePathname();
  const { data } = useSession();
  const { data: user } = useGetUser(data?.user.id!);

  const logout = () => {
    signOut();
  };

  return (
    <Sidebar className="bg-white shadow-lg">
      <SidebarContent className="pt-6 px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 text-2xl font-bold hover:opacity-90 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-700 text-white shadow-sm">
                <Ticket className="size-5" />
              </div>
              <span className="bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
                EventIn.
              </span>
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="mb-2">
                <SidebarMenuButton
                  asChild
                  className={`rounded-lg transition-colors duration-200 ${
                    pathname === "/"
                      ? "bg-purple-50 text-purple-700 hover:bg-purple-100"
                      : "hover:bg-gray-50"
                  }`}>
                  <Link href="/" className="flex items-center gap-3 p-3">
                    <Layout className="size-5" />
                    <span className="font-medium">Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="mb-2">
                <SidebarMenuButton
                  asChild
                  className={`rounded-lg transition-colors duration-200 ${
                    pathname === "/dashboard"
                      ? "bg-purple-50 text-purple-700 hover:bg-purple-100"
                      : "hover:bg-gray-50"
                  }`}>
                  <Link
                    href="/dashboard/"
                    className="flex items-center gap-3 p-3">
                    <Home className="size-5" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {items.map((item, idx) => (
                <Collapsible
                  defaultOpen
                  className="group/collapsible mb-1"
                  key={idx}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full rounded-lg p-3 hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-center gap-3">
                          <item.icon className="size-5 text-gray-500" />
                          <span className="font-medium text-gray-700">
                            {item.title}
                          </span>
                          <ChevronRight className="ml-auto size-4 transition-transform duration-200 text-gray-400 group-data-[state=open]/collapsible:rotate-90" />
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subitems.map((subitem, idx) => (
                          <SidebarMenuSubItem key={idx}>
                            <Link href={subitem.url}>
                              <SidebarMenuButton
                                className={`w-full rounded-lg py-3 px-4 transition-all duration-200 ${
                                  pathname === subitem.url
                                    ? "bg-purple-50 text-purple-700 hover:bg-purple-100"
                                    : "text-gray-600 hover:bg-purple-50 hover:translate-x-1"
                                }`}>
                                <span className="text-sm font-medium">
                                  {subitem.title}
                                </span>
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
      {user?.id && (
        <SidebarFooter className="border-t p-6 mt-auto bg-muted/5">
          <div className="flex items-center gap-4 group">
            <Avatar className="h-10 w-10 ring-2 ring-primary/10 transition-transform duration-200 group-hover:scale-105">
              <AvatarImage
                src={user.profilePicture ?? ""}
                alt={user.fullName}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {user.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1">
              <span className="font-semibold">{user.fullName}</span>
              <Link
                href={`/dashboard/profile/edit/${user.id}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors relative inline-block group-hover:underline">
                Edit Profile
              </Link>
            </div>
          </div>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start mt-4",
              "transition-all duration-200",
              "hover:bg-destructive/10 hover:text-destructive",
              "group active:scale-98"
            )}
            onClick={logout}>
            <LogOut className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
            Logout
          </Button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default DashboardSidebar;
