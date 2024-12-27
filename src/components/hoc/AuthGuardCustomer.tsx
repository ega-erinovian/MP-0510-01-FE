import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../dashboard/Loading";

export default function CustomerAuthGuard(Component: any) {
  return function IsAuth(props: any) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/login");
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
