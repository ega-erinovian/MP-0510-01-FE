"use client";

import DataNotFound from "@/components/dashboard/DataNotFound";
import Loading from "@/components/dashboard/Loading";
import PaginationSection from "@/components/dashboard/PaginationSection";
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
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [take, setTake] = useState<number>(8);
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [debouncedSearch] = useDebounce(search, 1000);
  const [searchCity, setSearchCity] = useState("");
  const [open, setOpen] = useState(false);
  const [debouncedSearchCity] = useDebounce(searchCity, 500);
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
    sortBy,
    sortOrder,
    search: debouncedSearch || "",
    take,
    categoryId: parseInt(categoryId),
    cityId: parseInt(cityId),
  });

  const onChangePage = (page: number) => {
    setPage(page);
  };

  const onChangeTake = (newTake: number) => {
    setTake(newTake);
    setPage(1);
  };

  const onSortChange = (column: string, order: string) => {
    setSortBy(column);
    setSortOrder(order);
  };

  const onSearch = (query: string) => {
    setSearch(query);
  };

  const onCategoryChange = (categoryId: string) => {
    setCategoryId(categoryId);
  };

  const onCityChange = (cityId: string) => {
    setCityId(cityId);
  };

  const showCities = debouncedSearchCity.length > 0 && !isPendingCities;

  if (error) {
    return <DataNotFound text="Error fetching events" />;
  }

  return (
    <HomePageLayout>
      <h1 className="text-9xl tracking-tighter mb-8">Browse Events</h1>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex justify-between items-center relative w-96 gap-2">
          <Input
            value={search}
            placeholder="Search Title..."
            onChange={(e) => onSearch(e.target.value)}
            disabled={isPending}
          />
          {search !== "" && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1); // Reset the page if needed
              }}
              className="h-full w-fit font-bold text-red-500 hover:text-red-600">
              <X />
            </button>
          )}
        </div>
        <div className="flex gap-4 items-center h-full">
          <div>
            <select
              onChange={(e) => onCategoryChange(e.target.value)}
              value={categoryId || ""}
              className="p-2 border border-gray-300 rounded"
              disabled={isPendingCategories}>
              <option value="">All Categories</option>
              {categories?.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full h-full flex gap-1">
            <div className="w-full h-full">
              <Popover open={open} onOpenChange={setOpen}>
                {isPendingCities && searchCity !== "" ? (
                  <PopoverTrigger
                    asChild
                    disabled={true}
                    className="w-full justify-between h-full">
                    <Button>Searching Cities...</Button>
                  </PopoverTrigger>
                ) : (
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      role="combobox"
                      className="w-full justify-between h-full hover:bg-purple-700">
                      {cityId
                        ? cities?.find(
                            (city: any) => city.id.toString() === cityId
                          )?.name
                        : "Search City"}
                    </Button>
                  </PopoverTrigger>
                )}

                <PopoverContent
                  className="w-full min-w-[240px] p-0"
                  align="start">
                  <div className="border-b px-3 py-2 relative flex items-center gap-2">
                    <input
                      className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
                      placeholder="Search City"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                    />
                    {isPendingCities && debouncedSearchCity.length > 0 && (
                      <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                    )}
                  </div>
                  <div>
                    {debouncedSearchCity.length > 0 &&
                      !isPendingCities &&
                      cities?.length === 0 && (
                        <p className="p-4 text-sm text-muted-foreground">
                          No cities found.
                        </p>
                      )}
                    {showCities &&
                      cities?.map((city) => (
                        <button
                          name="cityId"
                          type="button"
                          key={city.id}
                          onClick={() => {
                            setCityId(city.id.toString());
                            setOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center justify-between px-3 py-2 hover:bg-accent",
                            cityId === city.id.toString() && "bg-accent"
                          )}>
                          {city.name}
                          {cityId === city.id.toString() && (
                            <Check className="h-4 w-4" />
                          )}
                        </button>
                      ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            {cityId && (
              <button
                onClick={() => {
                  setCityId("");
                  setSearchCity("");
                  setPage(1); // Reset the page if needed
                }}
                className="h-full w-fit font-bold text-red-500 hover:text-red-600">
                <X />
              </button>
            )}
          </div>
        </div>
      </div>
      {events && events.data.length <= 0 && (
        <DataNotFound text="Data Not Found" />
      )}
      <div className="grid gap-4 md:grid-cols-4">
        {isPending ? (
          <Loading text="Events" />
        ) : (
          events?.data.map((event) => {
            return (
              <Link href={`/events/${event.id}`} key={event.id}>
                <EventCard event={event} />
              </Link>
            );
          })
        )}
      </div>
      {events && (
        <div className="w-full flex justify-end items-center">
          <PaginationSection
            onChangePage={onChangePage}
            page={Number(page)}
            take={events.meta.take || 4}
            total={events.meta.total}
          />
        </div>
      )}
    </HomePageLayout>
  );
};

export default EventsComponent;
