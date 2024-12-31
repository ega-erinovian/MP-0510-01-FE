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

// Menu items.
const items = [
  {
    title: "Transaction History",
    url: "/profile",
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

  const logout = () => {
    signOut();
  };

  return (
    <Sidebar variant="floating" className="pt-20">
      <SidebarContent className="pt-4 ps-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="mb-2"></SidebarMenuItem>
              {items.map((item, idx) => (
                <SidebarMenuItem className="mb-2" key={idx}>
                  <Link href={item.url}>
                    <SidebarMenuButton className="font-semibold">
                      <>
                        <item.icon />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {user?.id && (
        <SidebarFooter className="border-t p-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage
                src={user.profilePicture ?? ""}
                alt={user.fullName}
                className="object-cover"
              />
              <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">{user.fullName}</span>
              <Link
                href={`/profile/edit/${user.id}`}
                className="text-sm text-muted-foreground hover:underline">
                Edit Profile
              </Link>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start mt-4"
            onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default ProfileSidebar;
