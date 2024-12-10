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
import { FC, useState, useEffect } from "react";

interface VoucherTableInterface {
  data: VoucherType[];
  isLoading: boolean;
}

const columns: ColumnDef<VoucherType>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <SortableHeaderButton column={column} label="ID" />,
    cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    accessorFn: (row) => row.isUsed,
    cell: ({ row }) =>
      row.original.isUsed ? (
        <div className="capitalize bg-red-300 rounded-full text-red-700 font-semibold py-2 px-4 w-fit">
          Used
        </div>
      ) : (
        <div className="capitalize bg-green-200 rounded-full text-green-800 font-semibold py-2 px-4 w-fit">
          Available
        </div>
      ),
  },
  {
    accessorKey: "eventTitle",
    header: "Event",
    accessorFn: (row) => row.event.title,
    cell: ({ row }) => (
      <div className="capitalize">{row.original.event.title}</div>
    ),
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => <div className="capitalize">{row.getValue("code")}</div>,
  },
  {
    accessorKey: "discAmount",
    header: ({ column }) => (
      <SortableHeaderButton column={column} label="Amount" />
    ),
    cell: ({ row }) => <CurrencyCell value={Number(row.original.amount)} />,
    sortingFn: (a, b) => a.original.amount - b.original.amount,
  },
  {
    accessorKey: "expiresAt",
    header: ({ column }) => (
      <SortableHeaderButton column={column} label="Exp" />
    ),
    cell: ({ row }) => <DateCell date={row.getValue("expiresAt")} />,
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => <ActionMenu row={row} />,
  },
];

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

const DateCell: FC<{ date: string }> = ({ date }) => {
  const formattedDate = new Intl.DateTimeFormat("en-ID", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
  return <div className="capitalize">{formattedDate}</div>;
};

const CurrencyCell: FC<{ value: number }> = ({ value }) => (
  <div>
    {value.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
  </div>
);

const ActionMenu: FC<{ row: any }> = ({ row }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Open menu</span>
        <MoreHorizontal />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <Link href={`/organizer/1/edit-voucher?id=${row.original.id}`}>
        <DropdownMenuItem>Edit Voucher</DropdownMenuItem>
      </Link>
      <Link href={`/organizer/1/delete-voucher?id=${row.original.id}`}>
        <DropdownMenuItem>Delete Voucher</DropdownMenuItem>
      </Link>
    </DropdownMenuContent>
  </DropdownMenu>
);

const VoucherTable: FC<VoucherTableInterface> = ({ data, isLoading }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all-vouchers");

  useEffect(() => {
    if (selectedStatus === "all-vouchers") {
      setColumnFilters([]);
    } else if (selectedStatus === "used") {
      setColumnFilters([{ id: "status", value: true }]);
    } else if (selectedStatus === "active") {
      setColumnFilters([{ id: "status", value: false }]);
    }
  }, [selectedStatus]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      <HeaderSection
        isLoading={isLoading}
        data={data}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        table={table}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />
      <TableSection table={table} isLoading={isLoading} />
      <PaginationControls table={table} />
    </div>
  );
};

const HeaderSection: FC<{
  isLoading: boolean;
  data: VoucherType[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  table: any;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}> = ({
  isLoading,
  data,
  globalFilter,
  setGlobalFilter,
  table,
  selectedStatus,
  setSelectedStatus,
}) => {
  return (
    <div className="w-full flex items-center justify-between py-4">
      <p className="text-2xl font-semibold">
        {isLoading ? "Loading vouchers..." : `${data.length} Vouchers`}
      </p>
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm w-[300px]"
        />
        <ColumnVisibilityDropdown table={table} />
        <StatusFilters
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
      </div>
    </div>
  );
};

const StatusFilters: FC<{
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}> = ({ selectedStatus, setSelectedStatus }) => (
  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
    <SelectTrigger className="w-[140px] text-black">
      <SelectValue placeholder="Select Status" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="all-vouchers">All Vouchers</SelectItem>
        <SelectItem value="used">Used</SelectItem>
        <SelectItem value="active">Available</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
);

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

const PaginationControls: FC<{ table: any }> = ({ table }) => (
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
    <div className="text-sm">
      Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
    </div>
  </div>
);

export default VoucherTable;
