"use client";

import DataNotFound from "@/components/dashboard/DataNotFound";
import Loading from "@/components/dashboard/Loading";
import { Input } from "@/components/ui/input";
import useGetCategories from "@/hooks/api/category/useGetCategories";
import useGetEvents from "@/hooks/api/event/useGetEvents";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import EventsTable from "./components/EventTable";
import { useQueryState } from "nuqs";

const EventList = () => {
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [debouncedSearch] = useDebounce(search, 1000);
  const [take, setTake] = useState<number>(10);
  const [categoryId, setCategoryId] = useQueryState("categoryId", {
    defaultValue: "",
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
  });

  const { data: categories, isPending: isPendingCategories } =
    useGetCategories();

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

  if (error) {
    return <DataNotFound text="Error fetching events" resetSearch={onSearch} />;
  }

  return (
    <div className="mx-auto p-8">
      <h1 className="text-9xl mb-8 font-bold">Events</h1>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex justify-between items-center relative w-96">
          <Input
            value={search}
            placeholder="Search vouchers..."
            onChange={(e) => onSearch(e.target.value)}
            disabled={isPending}
          />
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor="sortBy" className="text-lg">
            Sort By:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value, sortOrder)}
            className="border rounded px-2 py-1"
            disabled={isPending}>
            <option value="id">ID</option>
            <option value="startDate">Start Date</option>
            <option value="endDate">End Date</option>
            <option value="price">Price</option>
            <option value="availableSeats">Available Seats</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(sortBy, e.target.value)}
            className="border rounded px-2 py-1"
            disabled={isPending}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
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
      </div>

      {isPending ? (
        <Loading text="Events" />
      ) : (
        <EventsTable
          events={events?.data || []}
          totalPages={Math.ceil((events?.meta?.total || 0) / take)}
          onChangePage={onChangePage}
          page={page}
          onChangeTake={onChangeTake}
          take={take}
        />
      )}
    </div>
  );
};

export default EventList;
