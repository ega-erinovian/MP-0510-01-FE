"use client";

import DataNotFound from "@/components/dashboard/DataNotFound";
import PaginationSection from "@/components/dashboard/PaginationSection";
import EventSkeleton from "@/components/skeletons/EventSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useGetCategories from "@/hooks/api/category/useGetCategories";
import useGetCities from "@/hooks/api/city/useGetCities";
import useGetEvents from "@/hooks/api/event/useGetEvents";
import { cn } from "@/lib/utils";
import { Check, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import HomePageLayout from "../../components/HomePageLayout";
import EventCard from "../home/components/EventCard";

const EventsComponent = () => {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [debouncedSearch] = useDebounce(search, 500);
  const [searchCity, setSearchCity] = useState("");
  const [debouncedSearchCity] = useDebounce(searchCity, 500);
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useQueryState("categoryId", {
    defaultValue: "",
  });
  const [cityId, setCityId] = useQueryState("cityId", {
    defaultValue: "",
  });

  const { data: categories, isPending: isPendingCategories } =
    useGetCategories();
  const { data: cities, isPending: isPendingCities } = useGetCities({
    search: debouncedSearchCity.length > 0 ? debouncedSearchCity : "",
  });
  const {
    data: events,
    isPending,
    error,
  } = useGetEvents({
    page,
    sortBy: "id",
    sortOrder: "desc",
    search: debouncedSearch || "",
    take: 12,
    categoryId: parseInt(categoryId),
    cityId: parseInt(cityId),
  });

  const onChangePage = (page: number) => setPage(page);
  const onSearch = (query: string) => setSearch(query);
  const onCategoryChange = (categoryId: string) => setCategoryId(categoryId);

  const showCities = debouncedSearchCity.length > 0 && !isPendingCities;

  if (error) return <DataNotFound text="Error fetching events" />;

  return (
    <HomePageLayout>
      <div className="space-y-6 sm:space-y-8 md:space-y-10">
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl tracking-tighter font-bold">
          Browse Events
        </h1>
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:w-96 relative flex items-center gap-2">
            <Input
              value={search}
              placeholder="Search Title..."
              onChange={(e) => onSearch(e.target.value)}
              disabled={isPending && !events}
              className="h-10"
            />
            {search !== "" && (
              <Button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                variant="ghost"
                size="icon"
                className="h-10 w-10 shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50">
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <select
              onChange={(e) => onCategoryChange(e.target.value)}
              value={categoryId || ""}
              className="h-10 px-3 rounded-md border border-input bg-background hover:bg-accent/50 transition-colors w-full sm:w-auto"
              disabled={isPending && isPendingCategories && !events}>
              <option value="">All Categories</option>
              {categories?.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                  asChild
                  disabled={
                    isPending && isPendingCities && searchCity !== "" && !events
                  }>
                  <Button
                    variant="outline"
                    disabled={
                      isPending &&
                      isPendingCities &&
                      searchCity !== "" &&
                      !events
                    }
                    className="w-full sm:w-[200px] h-10 justify-between">
                    {isPendingCities && searchCity !== "" ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Searching...
                      </span>
                    ) : cityId ? (
                      cities?.find((city: any) => city.id.toString() === cityId)
                        ?.name
                    ) : (
                      "Search City"
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0" align="end">
                  <div className="flex items-center border-b p-2">
                    <Input
                      className="border-0 focus-visible:ring-0 text-sm"
                      placeholder="Search city..."
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      disabled={
                        isPending &&
                        isPendingCities &&
                        searchCity !== "" &&
                        !events
                      }
                    />
                  </div>
                  <div className="max-h-[200px] overflow-y-auto">
                    {showCities && cities?.length === 0 ? (
                      <p className="p-3 text-sm text-muted-foreground">
                        No cities found.
                      </p>
                    ) : (
                      showCities &&
                      cities?.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => {
                            setCityId(city.id.toString());
                            setOpen(false);
                          }}
                          className={cn(
                            "w-full px-3 py-2 text-sm text-left hover:bg-accent transition-colors",
                            cityId === city.id.toString() && "bg-accent"
                          )}>
                          <div className="flex items-center justify-between">
                            <span>{city.name}</span>
                            {cityId === city.id.toString() && (
                              <Check className="h-4 w-4" />
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              {cityId && (
                <Button
                  onClick={() => {
                    setCityId("");
                    setSearchCity("");
                    setPage(1);
                  }}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50">
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {events && events.data.length <= 0 && !isPending && (
          <DataNotFound text="Event Not Found" />
        )}

        {isPending && !events ? (
          <EventSkeleton dataQty={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {events.data.map((event) => (
              <Link
                href={`/events/${event.id}`}
                key={event.id}
                className="transition-transform hover:scale-[1.02] duration-200">
                <EventCard event={event} />
              </Link>
            ))}
          </div>
        )}
        {events &&
          events.data.length > 0 &&
          events.meta.total > events.meta.take && (
            <div className="w-full flex justify-end items-center pt-4 sm:pt-6">
              <PaginationSection
                onChangePage={onChangePage}
                page={Number(page)}
                take={events.meta.take || 4}
                total={events.meta.total}
              />
            </div>
          )}
      </div>
    </HomePageLayout>
  );
};

export default EventsComponent;
