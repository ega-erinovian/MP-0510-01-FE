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
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { FC, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { VoucherType } from "@/types/voucher";
import useDeleteVoucher from "@/hooks/api/vouchers/useDeleteVoucher";

interface VouchersTableProps {
  vouchers: VoucherType[];
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

const VouchersTable: FC<VouchersTableProps> = ({
  vouchers,
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
  const voucherTableCols = [
    "id",
    "status",
    "event",
    "code",
    "amount",
    "expires at",
    "actions",
  ];

  const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteVoucherMutation = useDeleteVoucher(selectedVoucherId || 0);

  const handleDeleteClick = (voucherId: number) => {
    setSelectedVoucherId(voucherId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedVoucherId) {
      await deleteVoucherMutation.mutateAsync();
      setIsDeleteDialogOpen(false);
      setSelectedVoucherId(null);
    }
  };

  return (
    <div className="w-full">
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              voucher.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteVoucherMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600 gap-2"
              disabled={deleteVoucherMutation.isPending}>
              {deleteVoucherMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {deleteVoucherMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex justify-between items-center relative w-96">
          <Input
            value={search}
            placeholder="Search vouchers..."
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
            <option value="amount">Amount</option>
            <option value="expiresAt">Expire Date</option>
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
            {voucherTableCols.map((col) => (
              <TableHead key={col} className="font-semibold capitalize">
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {vouchers.map((voucher) => (
            <TableRow key={voucher.id}>
              <TableCell className="font-medium">{voucher.id}</TableCell>
              <TableCell className="font-medium">
                {voucher.isUsed ? (
                  <div className="capitalize bg-red-300 rounded-full text-red-700 font-semibold py-2 px-4 w-fit">
                    Used
                  </div>
                ) : (
                  <div className="capitalize bg-green-200 rounded-full text-green-800 font-semibold py-2 px-4 w-fit">
                    Available
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">
                {voucher.event.title}
              </TableCell>
              <TableCell className="font-medium">{voucher.code}</TableCell>
              <TableCell className="font-medium">
                {voucher.amount.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </TableCell>
              <TableCell className="font-medium">
                {new Intl.DateTimeFormat("en-ID", {
                  dateStyle: "full",
                  timeStyle: "short",
                  timeZone: "Asia/Jakarta",
                }).format(new Date(voucher.expiresAt))}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      disabled={
                        deleteVoucherMutation.isPending &&
                        selectedVoucherId === voucher.id
                      }>
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/dashboard/vouchers/edit/${voucher.id}`}>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                    </Link>
                    <Separator />
                    <DropdownMenuItem
                      className="text-red-600 cursor-pointer hover:bg-red-300 hover:text-red-600"
                      onClick={() => handleDeleteClick(voucher.id)}>
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

export default VouchersTable;
