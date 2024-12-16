"use client";

import { useState } from "react";
import Loading from "@/components/dashboard/Loading";
import useGetEvents from "@/hooks/api/event/useGetEvents";
import { useDebounce } from "use-debounce";
import DataNotFound from "@/components/dashboard/DataNotFound";
import useGetTransactions from "@/hooks/api/transaction/useGetTransactions";
import TranscationsTable from "./components/TransactionsTable";

const TransactionsList = () => {
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebounce(search, 1000);
  const [take, setTake] = useState<number>(10);

  const { data, isPending, error } = useGetTransactions({
    page,
    sortBy,
    sortOrder,
    search: debouncedSearch || "",
    take,
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
    return <Loading text="Transactions" />;
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
      <h1 className="text-9xl mb-8 font-bold">Transactions List</h1>

      <TranscationsTable
        transactions={data.data}
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

export default TransactionsList;
