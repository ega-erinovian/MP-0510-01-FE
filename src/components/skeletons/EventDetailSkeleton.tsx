import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const EventDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 lg:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
          <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-[16/9] w-full overflow-hidden rounded-lg">
            <Skeleton className="w-full h-full" />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-12 w-96" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-4 lg:h-8 w-4 lg:w-8 rounded-lg" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Skeleton className="h-8 lg:h-12 w-8 lg:w-12 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Card className="border-zinc-200">
              <CardHeader className="pb-4">
                <Skeleton className="h-4 w-[250px]" />
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <Skeleton className="h-4 lg:h-8 w-4 lg:w-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-[250px]" />
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <Skeleton className="h-4 lg:h-8 w-4 lg:w-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-[250px]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200">
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-[250px]" />
              </CardHeader>
              <CardContent className="space-y-6">
                <Skeleton className="w-1/2 h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-[50px]" />
                  <Skeleton className="h-4 w-[75px]" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-zinc-200">
            <CardContent className="p-4 sm:p-6 space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-[250px]" />

              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetailSkeleton;
