"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import globalFilterFn from "@/utils/globalFilterFn";
import {
  ColumnDef,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { FC, useState, useEffect, useMemo } from "react";

// Event Type Interface
interface EventType {
  id: number;
  category: { name: string };
  title: string;
  startDate: Date;
  endDate: Date;
  city: { name: string };
  price: number;
  availableSeats: number;
}

interface EventTableInterface {
  data: EventType[];
  isLoading: boolean;
}

// Column Definitions
const columns: ColumnDef<EventType>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <SortableHeaderButton column={column} label="ID" />,
    cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "categoryName",
    header: "Category",
    accessorFn: (row) => row.category.name,
    cell: ({ row }) => (
      <div className="capitalize">{row.original.category.name}</div>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <SortableHeaderButton column={column} label="Start" />
    ),
    cell: ({ row }) => <DateCell date={row.getValue("startDate")} />,
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <SortableHeaderButton column={column} label="End" />
    ),
    cell: ({ row }) => <DateCell date={row.getValue("endDate")} />,
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.city.name}</div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <SortableHeaderButton column={column} label="Revenue" />
    ),
    cell: ({ row }) => <CurrencyCell value={Number(row.original.price)} />,
    sortingFn: (a, b) => a.original.price - b.original.price,
  },
  {
    accessorKey: "availableSeats",
    header: ({ column }) => (
      <SortableHeaderButton column={column} label="Total Seats" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("availableSeats")}</div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => <ActionMenu row={row} />,
  },
];

// Sortable Header Button Component
const SortableHeaderButton: FC<{ column: any; label: string }> = ({
  column,
  label,
}) => (
  <Button
    variant="ghost"
    className="px-2"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
    {label} <ArrowUpDown />
  </Button>
);

// Date Formatter Cell Component
const DateCell: FC<{ date: string }> = ({ date }) => {
  const formattedDate = new Intl.DateTimeFormat("en-ID", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
  return <div className="capitalize">{formattedDate}</div>;
};

// Currency Formatter Cell Component
const CurrencyCell: FC<{ value: number }> = ({ value }) => (
  <div>
    {value.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
  </div>
);

// Action Menu Component for Event Actions
const ActionMenu: FC<{ row: any }> = ({ row }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Open menu</span>
        <MoreHorizontal />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <Link href={`/dashboard/1/event-attendee?id=${row.original.id}`}>
        <DropdownMenuItem>Attendee List</DropdownMenuItem>
      </Link>
      <Separator />
      <Link href={`/dashboard/1/edit-event?id=${row.original.id}`}>
        <DropdownMenuItem>Edit Event</DropdownMenuItem>
      </Link>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Main EventTable Component
const EventTable: FC<EventTableInterface> = ({ data, isLoading }) => {
  // Default Sorting by ID (Descending)
  const [sorting, setSorting] = useState<SortingState>([
    { id: "id", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageSize: 10, // default to 10 rows per page
    pageIndex: 0, // default to the first page
  });

  // Memoized Table Configuration
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handlePageSizeChange = (size: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: size,
      pageIndex: 0, // reset to the first page when page size changes
    }));
  };

  return (
    <div className="w-full">
      <HeaderSection
        isLoading={isLoading}
        data={data}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        table={table}
      />
      <TableSection table={table} isLoading={isLoading} />
      <PaginationControls table={table} setPageSize={handlePageSizeChange} />
    </div>
  );
};

// Header Section Component with Filter and Sorting Options
const HeaderSection: FC<{
  isLoading: boolean;
  data: EventType[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  table: any;
}> = ({ isLoading, data, globalFilter, setGlobalFilter, table }) => {
  const categories = useMemo(
    () => Array.from(new Set(data.map((event) => event.category.name))),
    [data]
  );

  return (
    <div className="w-full flex items-center justify-between py-4">
      <p className="text-2xl font-semibold">
        {isLoading ? "Loading events..." : `${data.length} Events`}
      </p>
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm w-[300px]"
        />
        <ColumnVisibilityDropdown table={table} />
        <TimeCategoryFilters
          data={data}
          table={table}
          categories={categories}
        />
      </div>
    </div>
  );
};

// Time and Category Filters Component
const TimeCategoryFilters: FC<{
  data: EventType[];
  table: any;
  categories: string[];
}> = ({ data, table, categories }) => {
  const [selectedTime, setSelectedTime] = useState("all-event");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Apply Category Filter
  useEffect(() => {
    const newFilters =
      selectedCategory === "all"
        ? []
        : [{ id: "categoryName", value: selectedCategory }];
    table.setColumnFilters(newFilters);
  }, [selectedCategory, table]);

  return (
    <>
      <Select value={selectedTime} onValueChange={setSelectedTime}>
        <SelectTrigger className="w-[120px] text-black">
          <SelectValue placeholder="Select Time" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all-event">All Event</SelectItem>
            <SelectItem value="sold-out">Sold Out</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-[150px] text-black">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};

// Column Visibility Dropdown Component
const ColumnVisibilityDropdown: FC<{ table: any }> = ({ table }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="ml-auto">
        Columns <ChevronDown />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {table
        .getAllColumns()
        .filter((column: any) => column.getCanHide())
        .map((column: any) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            className="capitalize"
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}>
            {column.id}
          </DropdownMenuCheckboxItem>
        ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

// Table Section Component
const TableSection: FC<{ table: any; isLoading: boolean }> = ({
  table,
  isLoading,
}) => (
  <div className="rounded-md border">
    {isLoading ? (
      <div className="p-6 text-center">Loading...</div>
    ) : (
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup: any) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row: any) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell: any) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )}
  </div>
);

// Pagination Controls Component
const PaginationControls: FC<{
  table: any;
  setPageSize: (size: number) => void;
}> = ({ table, setPageSize }) => (
  <div className="flex justify-between py-4">
    <div className="flex gap-2">
      <Button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}>
        Previous
      </Button>
      <Button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}>
        Next
      </Button>
    </div>

    {/* Rows per page select */}
    <div className="flex items-center gap-2">
      <span>Rows per page:</span>
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
        className="border p-1 rounded">
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
      </select>
    </div>

    <div className="text-sm">
      Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
    </div>
  </div>
);

export default EventTable;
