"use client";

import DataNotFound from "@/components/dashboard/DataNotFound";
import Loading from "@/components/dashboard/Loading";
import { Input } from "@/components/ui/input";
import useGetVouchers from "@/hooks/api/voucher/useGetVouchers";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import VoucherTable from "./components/VoucherTable";
import { useQueryState } from "nuqs";
import { useSession } from "next-auth/react";

const VoucherList = () => {
  const { data: sessionData } = useSession(); // dari next-auth
  const user = sessionData?.user;

  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [debouncedSearch] = useDebounce(search, 500);
  const [take, setTake] = useState<number>(10);

  const { data, isPending, error } = useGetVouchers({
    page,
    sortBy,
    sortOrder,
    search: debouncedSearch || "",
    take,
    userId: Number(user?.id),
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

  if (error) {
    return <DataNotFound text="Error fetching transactions" />;
  }

  return (
    <div className="mx-auto p-8">
      <h1 className="text-9xl mb-8 font-bold">Vouchers</h1>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex justify-between items-center relative w-96">
          <Input
            value={search}
            placeholder="Search Event or Voucher's Code (Case Sensitive)"
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
            <option value="amount">Amount</option>
            <option value="expiresAt">Expire Date</option>
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
      </div>

      {isPending ? (
        <Loading text="Vouchers" />
      ) : (
        <VoucherTable
          vouchers={data.data}
          totalPages={data.meta.total / take}
          onChangePage={onChangePage}
          page={page}
          onChangeTake={onChangeTake}
          take={take}
        />
      )}
    </div>
  );
};

export default VoucherList;
