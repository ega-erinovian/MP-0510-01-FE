"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Ticket } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const Navbar = () => {
  const router = useRouter();

  const { data } = useSession();

  const user = data?.user;

  const logout = () => {
    signOut();
  };

  return (
    <nav className="sticky top-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="text-2xl">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold transition-all">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-700 text-primary-foreground">
                <Ticket className="size-4" color="#fafafa" />
              </div>
              EventIn.
            </Link>
          </div>

          <div className="hidden cursor-pointer items-center gap-8 text-sm font-semibold md:flex">
            <Link href="/" className="hover:text-purple-700">
              Home
            </Link>
            <Link href="/events" className="hover:text-purple-700">
              Browse
            </Link>
            {!user?.id && (
              <Link href="/login">
                <Button className="hover:bg-purple-700">Sign in</Button>
              </Link>
            )}
            {!!user?.id && (
              <>
                <Link
                  href={
                    user?.role === "CUSTOMER"
                      ? `/profile`
                      : `/dashboard/profile/edit/${user?.id}`
                  }
                  className="hover:text-purple-700">
                  Profile
                </Link>
                <p onClick={logout} className="hover:text-purple-700">
                  Logout
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Menu />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/">Profile</Link>
                </DropdownMenuItem>

                {!user?.id && (
                  <DropdownMenuItem>
                    <Link href="/login">
                      <Button>Sign in</Button>
                    </Link>
                  </DropdownMenuItem>
                )}
                {!!user?.id && (
                  <>
                    <DropdownMenuItem>
                      <>
                        <p onClick={() => router.push("/write")}>Write</p>
                      </>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <>
                        <p onClick={logout}>Logout</p>
                      </>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
