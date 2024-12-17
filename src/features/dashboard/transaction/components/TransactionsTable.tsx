"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { CircleAlert, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { FC, useState } from "react";
import {
  getStatusColor,
  transactionStatus,
  transactionTableCols,
} from "../const";
import TransactionDeleteDialog from "./TransactionDeleteDialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TransactionEditDialog from "./TransactionEditDialog";

interface TransactionsTableProps {
  transactions: TransactionType[];
  totalPages: number;
  onChangePage: (page: number) => void;
  page: number;
  onChangeTake: (take: number) => void;
  take: number;
}

const TransactionsTable: FC<TransactionsTableProps> = ({
  transactions,
  totalPages,
  onChangePage,
  page,
  onChangeTake,
  take,
}) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="h-[50vh] w-full flex flex-col items-center justify-center gap-4">
        <CircleAlert className="fill-red-500 text-white w-16 h-16" />
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Data Not Found</h2>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            {transactionTableCols.map((col) => (
              <TableHead key={col} className="font-semibold capitalize">
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
                  {" "}
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
                {transaction.paymentProof ? (
                  <Link
                    href={transaction.paymentProof || "/dashboard/transactions"}
                    className="hover:text-blue-500 underline underline-offset-2"
                    target="_blank">
                    See Payment Proof
                  </Link>
                ) : (
                  "No Payment Proof"
                )}
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
                    <TransactionEditDialog
                      id={transaction.id}
                      status={transaction.status}
                      email={transaction.user.email}
                    />
                    <Separator />
                    <TransactionDeleteDialog id={transaction.id} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 flex justify-between items-center">
        {/* Items per page selection */}
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

export default TransactionsTable;
