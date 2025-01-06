import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const ProfileCardSkeleton = () => {
  return (
    <Card className="group transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
              <Skeleton className="h-12 w-72" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3 px-2">
                <Skeleton className="h-4 lg:h-8 w-4 lg:w-8 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>

              <div className="flex items-center gap-3 px-2">
                <Skeleton className="h-4 lg:h-8 w-4 lg:w-8 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCardSkeleton;
