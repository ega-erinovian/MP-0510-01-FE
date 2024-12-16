import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionType } from "@/types/transaction";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface TransactionsTableProps {
  transactions: TransactionType[];
  sortBy: string;
  sortOrder: string;
  onSortChange: (sortBy: string, sortOrder: string) => void;
  onSearch: (search: string) => void;
  search: string;
  totalPages: number;
  onChangePage: (page: number) => void;
  page: number;
  onChangeTake: (take: number) => void;
  take: number;
}

const TranscationsTable: FC<TransactionsTableProps> = ({
  transactions,
  sortBy,
  sortOrder,
  search,
  onSortChange,
  onSearch,
  totalPages,
  onChangePage,
  page,
  onChangeTake,
  take,
}) => {
  const transactionTableCols = [
    "id",
    "status",
    "name",
    "event",
    "QTY",
    "total",
    "transaction date",
    "payment proof",
    "action",
  ];

  // Function to get button color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "UNPAID":
        return "bg-red-500 text-white"; // Red for unpaid
      case "CONFIRMING":
        return "bg-amber-500 text-white"; // Yellow for confirming
      case "DONE":
        return "bg-green-500 text-white"; // Green for done
      case "REJECTED":
        return "bg-gray-500 text-white"; // Gray for rejected
      case "EXPIRED":
        return "bg-purple-500 text-white"; // Purple for expired
      case "CANCELED":
        return "bg-blue-500 text-white"; // Blue for canceled
      default:
        return "bg-gray-300 text-black"; // Default fallback
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex justify-between items-center relative w-96">
          <Input
            value={search}
            placeholder="Search transactions..."
            onChange={(e) => onSearch(e.target.value)}
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
            className="border rounded px-2 py-1">
            <option value="id">ID</option>
            <option value="qty">QTY</option>
            <option value="totalPrice">Total</option>
            <option value="createdAt">Transaction Date</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(sortBy, e.target.value)}
            className="border rounded px-2 py-1">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {transactionTableCols.map((col) => (
              <TableHead key={col} className="capitalize">
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.id}</TableCell>
              <TableCell className="font-medium">
                <Button
                  variant="outline"
                  disabled
                  className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                    transaction.status
                  )}`}>
                  {transaction.status}
                </Button>
              </TableCell>
              <TableCell className="font-medium">
                {transaction.user.fullName}
              </TableCell>
              <TableCell className="font-medium">
                {transaction.event.title}
              </TableCell>
              <TableCell className="font-medium">{transaction.qty}</TableCell>
              <TableCell className="font-medium">
                {transaction.totalPrice.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </TableCell>
              <TableCell className="font-medium">
                {new Intl.DateTimeFormat("en-ID", {
                  dateStyle: "full",
                  timeStyle: "short",
                  timeZone: "Asia/Jakarta",
                }).format(new Date(transaction.createdAt))}
              </TableCell>
              <TableCell className="font-medium min-w-[120px] max-w-[200px] truncate">
                <Link
                  href={transaction.paymentProof || "/dashboard/transactions"}
                  className="hover:text-blue-500"
                  target="_blank">
                  {transaction.paymentProof || "No proof available"}
                </Link>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link
                      href={`/dashboard/transactions/edit/${transaction.id}`}>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                    </Link>
                    <Separator />
                    <DropdownMenuItem className="text-red-600 cursor-pointer">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 flex justify-between items-center">
        <div>
          <label className="mr-2">Items per page</label>
          <select
            value={take}
            onChange={(e) => onChangeTake(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded">
            {[10, 20, 50].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => onChangePage(page - 1)}
            disabled={page === 1}>
            Previous
          </Button>
          <span className="mx-2">
            Page {page} of {Math.ceil(totalPages)}
          </span>
          <Button
            variant="ghost"
            onClick={() => onChangePage(page + 1)}
            disabled={page === Math.ceil(totalPages)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TranscationsTable;
