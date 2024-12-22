import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../dashboard/Loading";
import { toast } from "react-toastify";

export default function AuthGuard(Component: any) {
  return function IsAuth(props: any) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/auth/login");
      }

      if (session) {
        if (session.user.role !== "ORGANIZER") {
          toast.error("You don't have access to this page.");
          router.push("/");
        }
      }
    }, [status, router]);

    if (status === "loading") {
      return (
        <div className="h-screen w-full flex items-center justify-center">
          <Loading text="Authentication" />
        </div>
      );
    }

    if (!session) {
      return null; // Prevent rendering until session is confirmed
    }

    return <Component {...props} />;
  };
}
