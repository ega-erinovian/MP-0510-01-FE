import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";
import Link from "next/link";

const MaintenanceComponent = async () => {
  const session = await auth();

  return (
    <div className="flex items-center justify-center h-screen">
      <main className="flex flex-col gap-4 items-center justify-center">
        <h1>
          Dear customer, This page is under maintenance. Please come back later.
        </h1>
        {!session?.user && (
          <Link href={"/auth/login"}>
            <Button>Sign In</Button>
          </Link>
        )}
        {!!session?.user && (
          <form
            action={async () => {
              "use server";
              await signOut();
            }}>
            <Button type="submit">Sign Out</Button>
          </form>
        )}
      </main>
    </div>
  );
};

export default MaintenanceComponent;
