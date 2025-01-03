"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Ticket } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data } = useSession();
  const user = data?.user;

  const logout = () => {
    signOut();
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
      <div className="container mx-auto px-6 py-4 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="text-2xl font-semibold flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                <Ticket className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">EventIn.</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-800">
            <Link href="/" className="transition-colors hover:text-purple-600">
              Home
            </Link>
            <Link
              href="/events"
              className="transition-colors hover:text-purple-600">
              Browse
            </Link>

            {/* Sign-in or Profile/Dashboard Links */}
            {!user?.id ? (
              <Link href="/login">
                <Button className="px-6 py-2 rounded-full bg-purple-600 text-white transition-all hover:bg-purple-700 shadow-md">
                  Sign in
                </Button>
              </Link>
            ) : (
              <>
                {user?.role === "CUSTOMER" ? (
                  <Link
                    href="/profile/transaction-history"
                    className="transition-colors hover:text-purple-600">
                    Profile
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="transition-colors hover:text-purple-600">
                    Dashboard
                  </Link>
                )}
                <p
                  onClick={logout}
                  className="cursor-pointer text-red-600 transition-colors hover:text-red-800">
                  Logout
                </p>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Menu
                  className="text-gray-700 hover:text-purple-600 cursor-pointer"
                  size={24}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white shadow-xl rounded-lg">
                <DropdownMenuItem>
                  <Link
                    href="/"
                    className="text-gray-800 hover:text-purple-600">
                    Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/events"
                    className="text-gray-800 hover:text-purple-600">
                    Browse
                  </Link>
                </DropdownMenuItem>

                {!user?.id && (
                  <DropdownMenuItem>
                    <Link href="/login">
                      <Button className="w-full px-6 py-2 rounded-full bg-purple-600 text-white transition-all hover:bg-purple-700">
                        Sign in
                      </Button>
                    </Link>
                  </DropdownMenuItem>
                )}
                {!!user?.id && (
                  <>
                    {user?.role === "CUSTOMER" && (
                      <DropdownMenuItem>
                        <Link
                          href="/profile/transaction-history"
                          className="text-gray-800 hover:text-purple-600">
                          Profile
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-red-600 hover:text-red-800">
                      Logout
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
