"use client";

import { useState } from "react";
import Loading from "@/components/dashboard/Loading";
import useGetEvents from "@/hooks/api/event/useGetEvents";
import { useDebounce } from "use-debounce";
import DataNotFound from "@/components/dashboard/DataNotFound";
import VouchersTable from "./components/VoucherTable";
import useGetVouchers from "@/hooks/api/vouchers/useGetVouchers";

const EventList = () => {
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebounce(search, 1000);
  const [take, setTake] = useState<number>(10);
  const [eventId, setEventId] = useState<number | undefined>(undefined);

  const { data, isPending, error } = useGetVouchers({
    page,
    sortBy,
    sortOrder,
    search: debouncedSearch || "",
    take,
    eventId,
  });

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

  if (isPending) {
    return <Loading text="Vouchers" />;
  }

  if (error) {
    return (
      <DataNotFound text="Error fetching vouchers" resetSearch={onSearch} />
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <DataNotFound
        text={`no data matched with: ${search}`}
        resetSearch={onSearch}
      />
    );
  }

  console.log(data);

  return (
    <div className="mx-auto p-8">
      <h1 className="text-9xl mb-8 font-bold">Voucher List</h1>

      <VouchersTable
        vouchers={data.data}
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
      />
    </div>
  );
};

export default EventList;
