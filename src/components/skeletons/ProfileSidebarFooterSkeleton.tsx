import { Skeleton } from "../ui/skeleton";

const ProfileSidebarFooterSkeleton = () => {
  return (
    <div className="flex items-center gap-4 group">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex flex-col flex-1 gap-2">
        <Skeleton className="h-4 w-[125px]" />
        <Skeleton className="h-4 w-[75px]" />
      </div>
    </div>
  );
};

export default ProfileSidebarFooterSkeleton;
