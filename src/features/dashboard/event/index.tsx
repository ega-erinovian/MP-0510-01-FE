"use client";

import { useState } from "react";
import Loading from "@/components/dashboard/Loading";
import { useDebounce } from "use-debounce";
import DataNotFound from "@/components/dashboard/DataNotFound";
import EventTable from "./components/EventTable";
import useGetEvents from "@/hooks/api/event/useGetEvents";
import useGetCategories from "@/hooks/api/category/useGetCategories";

const EventList = () => {
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebounce(search, 1000);
  const [take, setTake] = useState<number>(10);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

  const { data, isPending, error } = useGetEvents({
    page,
    sortBy,
    sortOrder,
    search: debouncedSearch || "",
    take,
    categoryId,
  });

  const { data: categories, isPending: isPendingCategories } =
    useGetCategories();

  const onChangePage = (page: number) => {
    setPage(page);
  };

  const onChangeTake = (newTake: number) => {
    setTake(newTake);
    setPage(1); // Reset to first page when items per page changes
  };

  const onSortChange = (column: string, order: string) => {
    setSortBy(column);
    setSortOrder(order);
  };

  const onSearch = (query: string) => {
    setSearch(query);
  };

  const onCategoryChange = (categoryId: number | undefined) => {
    setCategoryId(categoryId); // Set selected category
  };

  if (isPending) {
    return <Loading text="Events" />;
  }

  if (isPendingCategories) {
    return <Loading text="Events" />;
  }

  if (error) {
    return <DataNotFound text="Error fetching event" resetSearch={onSearch} />;
  }

  if (!data || data.data.length === 0) {
    return (
      <DataNotFound
        text={`no data matched with: ${search}`}
        resetSearch={onSearch}
      />
    );
  }

  return (
    <div className="mx-auto p-8">
      <h1 className="text-9xl mb-8 font-bold">Event List</h1>

      <EventTable
        events={data.data}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={onSortChange}
        onSearch={onSearch}
        totalPages={data.meta.total / take}
        search={search}
        onChangePage={onChangePage}
        page={page}
        onChangeTake={onChangeTake}
        take={take}
        categories={categories}
        categoryId={categoryId}
        onCategoryChange={onCategoryChange}
      />
    </div>
  );
};

export default EventList;
