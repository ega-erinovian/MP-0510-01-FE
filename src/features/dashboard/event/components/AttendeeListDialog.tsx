"use client";

import DataNotFound from "@/components/dashboard/DataNotFound";
import Loading from "@/components/dashboard/Loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/table-dialog";
import useGetTransactions from "@/hooks/api/transaction/useGetTransactions";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useDebounce } from "use-debounce";
import AttendeeListTable from "./AttendeeListTable";

interface AttendeeListProps {
  id: number;
  title: string;
}

const AttendeeListDialog: FC<AttendeeListProps> = ({ id, title }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebounce(search, 1000);
  const [take, setTake] = useState<number>(10);

  const {
    data: transactions,
    isPending,
    error,
  } = useGetTransactions({
    page,
    sortBy,
    sortOrder,
    search: debouncedSearch || "",
    take,
    eventId: id,
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
    return (
      <DataNotFound text="Error fetching attendees" resetSearch={onSearch} />
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setIsDialogOpen(true)}>
          Attendee List
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="mx-auto p-8 w-full">
          <h1 className="text-7xl mb-8 font-bold">{title}</h1>
          <div className="flex items-center justify-end gap-4 mb-4">
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
                <option value="qty">QTY</option>
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
            <Loading text="Attendees" />
          ) : (
            <AttendeeListTable
              title={title}
              attendees={transactions.data}
              totalPages={transactions.meta.total / take}
              onChangePage={onChangePage}
              page={page}
              onChangeTake={onChangeTake}
              take={take}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendeeListDialog;
