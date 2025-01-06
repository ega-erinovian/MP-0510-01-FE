import { Skeleton } from "../ui/skeleton";

const BarChartSkeleton = () => {
  return (
    <div className="min-h-[200px] h-full w-full py-8 pb-16">
      <div className="flex items-end justify-between space-x-4 w-full h-full">
        <Skeleton className="h-full w-20 bg-muted rounded-sm" />
        <Skeleton className="h-3/4 w-20 bg-muted rounded-sm" />
        <Skeleton className="h-2/3 w-20 bg-muted rounded-sm" />
        <Skeleton className="h-1/2 w-20 bg-muted rounded-sm" />
        <Skeleton className="h-2/3 w-20 bg-muted rounded-sm" />
        <Skeleton className="h-3/4 w-20 bg-muted rounded-sm" />
        <Skeleton className="h-full w-20 bg-muted rounded-sm" />
        <Skeleton className="h-3/4 w-20 bg-muted rounded-sm" />
        <Skeleton className="h-2/3 w-20 bg-muted rounded-sm" />
        <Skeleton className="h-1/2 w-20 bg-muted rounded-sm" />
        <Skeleton className="h-2/3 w-20 bg-muted rounded-sm" />
      </div>
    </div>
  );
};

export default BarChartSkeleton;
