"use client";

import DataNotFound from "@/components/dashboard/DataNotFound";
import Loading from "@/components/dashboard/Loading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetTransactions from "@/hooks/api/transaction/useGetTransactions";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useQueryState } from "nuqs";
import { useSession } from "next-auth/react";
import TransactionsList from "./TransactionsList";

const TransactionListWrapper = () => {
  const { data: sessionData } = useSession();
  const user = sessionData?.user;
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [debouncedSearch] = useDebounce(search, 1000);
  const [take, setTake] = useState<number>(10);

  const { data, isPending, error } = useGetTransactions({
    page,
    sortBy,
    sortOrder,
    search: debouncedSearch,
    take,
    customerId: Number(user?.id),
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

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <DataNotFound text="Error fetching transactions" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 py-6 lg:px-8 lg:py-8">
      <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 lg:mb-8">
        Transactions History
      </h1>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="w-full lg:w-96">
          <Input
            value={search}
            placeholder="Search transactions..."
            onChange={(e) => onSearch(e.target.value)}
            disabled={isPending}
            className="w-full"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Sort By:
            </span>
            <Select
              value={sortBy}
              onValueChange={(value) => onSortChange(value, sortOrder)}
              disabled={isPending}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="qty">Quantity</SelectItem>
                <SelectItem value="totalPrice">Total Price</SelectItem>
                <SelectItem value="createdAt">Transaction Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select
            value={sortOrder}
            onValueChange={(value) => onSortChange(sortBy, value)}
            disabled={isPending}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="">
        {isPending ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loading text="transactions..." />
          </div>
        ) : (
          <TransactionsList
            transactions={data.data}
            totalPages={data.meta.total / take}
            onChangePage={onChangePage}
            page={page}
            onChangeTake={onChangeTake}
            take={take}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionListWrapper;
