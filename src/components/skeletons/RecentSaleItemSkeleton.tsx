import { Skeleton } from "../ui/skeleton";

const RecentSalesItemSkeleton = () => {
  return (
    <div className="group border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4 py-4 px-2">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Skeleton className="w-12 h-12 rounded-xl" />
          </div>

          <div className="space-y-1">
            <Skeleton className="w-32 h-4 rounded-xl" />
            <Skeleton className="w-56 h-4 rounded-xl" />
          </div>
        </div>

        <div className="shrink-0">
          <Skeleton className="w-20 h-4 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default RecentSalesItemSkeleton;
