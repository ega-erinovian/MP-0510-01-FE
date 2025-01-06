import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const EventCardSkeleton = () => {
  return (
    <Card className="group relative h-full pb-14 sm:pb-16 border-zinc-200">
      <div className="relative w-full h-[180px] sm:h-[200px] overflow-hidden">
        <Skeleton className="rounded-t-lg rounded-b-none h-full w-full" />
      </div>

      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-[150px]" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
      </CardContent>

      <div className="absolute bottom-4 left-6 right-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex flex-col">
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventCardSkeleton;
