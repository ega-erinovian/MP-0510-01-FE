import React from "react";
import {
  ChevronRight,
  Ticket,
  GroupIcon,
  ClockIcon,
  LogOut,
  Key,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useGetUser from "@/hooks/api/user/useGetUser";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Transaction History",
    url: "/profile/transaction-history",
    icon: ClockIcon,
  },
  {
    title: "Referrals",
    url: "/profile/referrals",
    icon: GroupIcon,
  },
  {
    title: "Coupons",
    url: "/profile/coupons",
    icon: Ticket,
  },
  {
    title: "Reset Password",
    url: "/profile/update-password",
    icon: Key,
  },
];

const ProfileSidebar = () => {
  const { data } = useSession();
  const { data: user } = useGetUser(data?.user.id!);
  const pathname = usePathname();

  const logout = () => {
    signOut();
  };

  return (
    <Sidebar
      variant="floating"
      className="lg:pt-20 w-full lg:w-64 min-h-screen">
      <SidebarContent className="p-6 bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, idx) => (
                <SidebarMenuItem
                  key={idx}
                  className={cn(
                    "mb-2 relative overflow-hidden",
                    "before:content-[''] before:absolute before:left-0 before:w-1 before:h-full before:bg-primary before:rounded-r-full",
                    "before:transition-transform before:duration-300",
                    pathname === item.url
                      ? "before:translate-x-0"
                      : "before:-translate-x-full"
                  )}>
                  <Link href={item.url} className="w-full">
                    <SidebarMenuButton
                      className={cn(
                        "w-full font-medium transition-all duration-200",
                        "hover:bg-muted/50 rounded-lg p-4 py-6",
                        "group relative",
                        pathname === item.url
                          ? "text-primary translate-x-2"
                          : "text-muted-foreground hover:text-primary hover:translate-x-2"
                      )}>
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={cn(
                            "h-5 w-5 transition-transform duration-200",
                            pathname === item.url
                              ? "scale-110"
                              : "group-hover:scale-110"
                          )}
                        />
                        <span className="flex-1">{item.title}</span>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 opacity-50 transition-transform duration-200",
                            "group-hover:translate-x-1",
                            pathname === item.url && "opacity-100"
                          )}
                        />
                      </div>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {user?.id && (
        <SidebarFooter className="border-t p-6 mt-auto bg-muted/5 bg-white">
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
                href={`/profile/edit`}
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

export default ProfileSidebar;
