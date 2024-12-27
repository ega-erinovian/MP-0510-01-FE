"use client";

import DataNotFound from "@/components/dashboard/DataNotFound";
import Loading from "@/components/dashboard/Loading";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useGetTransactions from "@/hooks/api/transaction/useGetTransactions";
import { FC, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import AttendeeListTable from "./AttendeeListTable";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";

interface AttendeeListProps {
  id: number;
  title: string;
}

const AttendeeListDialog: FC<AttendeeListProps> = ({ id, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [take, setTake] = useState<number>(10);
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [debouncedSearch] = useDebounce(search, 1000);

  const {
    data: transactions,
    isPending,
    error,
  } = useGetTransactions({
    page,
    sortBy,
    sortOrder,
    take,
    search: debouncedSearch || "",
    status: "DONE",
    eventId: id,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  if (error) {
    return (
      <DataNotFound
        text="Error fetching attendees"
        resetSearch={() => setSearch("")}
      />
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="w-full py-2 px-4 hover:bg-zinc-100 cursor-pointer font-semibold">
          Attendee List
        </div>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl"
        onClick={(e) => e.stopPropagation()} // Prevent event bubbling
      >
        <SheetTitle className="text-5xl font-bold">{title}</SheetTitle>
        <SheetDescription></SheetDescription>
        <div className="h-full flex flex-col">
          <div className="p-6">
            <div className="space-y-4">
              {/* <div className="w-full">
                <Input
                  type="text"
                  value={search}
                  placeholder="Search attendees..."
                  onChange={handleSearchChange}
                  onFocus={(e) => e.stopPropagation()}
                  className="w-full"
                />
              </div> */}
              <div className="flex flex-wrap items-center gap-4">
                <label
                  htmlFor="sortBy"
                  className="text-sm font-medium whitespace-nowrap">
                  Sort By:
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value, sortOrder)}
                  className="min-w-24 rounded-md border bg-transparent px-2 py-1.5 text-sm shadow-sm"
                  disabled={isPending}>
                  <option value="id">ID</option>
                  <option value="qty">QTY</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => onSortChange(sortBy, e.target.value)}
                  className="min-w-24 rounded-md border bg-transparent px-2 py-1.5 text-sm shadow-sm"
                  disabled={isPending}>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto px-6">
            {isPending ? (
              <Loading text="Attendees" />
            ) : (
              <AttendeeListTable
                title={title}
                transactions={transactions.data}
                totalPages={Math.ceil(transactions.meta.total / take)}
                onChangePage={onChangePage}
                page={page}
                onChangeTake={onChangeTake}
                take={take}
              />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AttendeeListDialog;
