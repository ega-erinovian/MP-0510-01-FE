"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionType } from "@/types/transaction";
import { CircleAlert } from "lucide-react";
import { FC } from "react";
import TransactionCard from "./TransactionCard";
import DataNotFound from "@/components/dashboard/DataNotFound";

interface TransactionsTableProps {
  transactions: TransactionType[];
  totalPages: number;
  onChangePage: (page: number) => void;
  page: number;
  onChangeTake: (take: number) => void;
  take: number;
}

const TransactionsList: FC<TransactionsTableProps> = ({
  transactions,
  totalPages,
  onChangePage,
  page,
  onChangeTake,
  take,
}) => {
  if (!transactions || transactions.length === 0) {
    return <DataNotFound text="No transactions found" />;
  }

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {transactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Items per page</span>
          <Select
            value={take.toString()}
            onValueChange={(value) => onChangeTake(Number(value))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChangePage(page - 1)}
            disabled={page === 1}
            className="h-8">
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {Math.ceil(totalPages)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChangePage(page + 1)}
            disabled={page === Math.ceil(totalPages)}
            className="h-8">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsList;
