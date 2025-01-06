import { Skeleton } from "../ui/skeleton";

const DashboardStatisticsSkeleton = () => {
  return (
    <>
      <Skeleton className="w-[50px] h-12" />
      <div className="flex items-center gap-2">
        <Skeleton className="w-[150px] h-4" />
        <Skeleton className="w-[50px] h-4" />
      </div>
    </>
  );
};

export default DashboardStatisticsSkeleton;
