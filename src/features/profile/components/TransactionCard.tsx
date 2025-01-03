import CronTimer from "@/components/TransactionTimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TransactionType } from "@/types/transaction";
import {
  Banknote,
  Calendar,
  Clock,
  MoreHorizontal,
  Package,
} from "lucide-react";
import PaymentProofDialog from "./PaymentProofDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TransactionEditDialog from "./TransactionEditDialog";
import { getStatusColor } from "../const";

const TransactionCard = ({ transaction }: { transaction: TransactionType }) => (
  <Card className="group transition-all hover:shadow-md">
    <CardContent className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-foreground">
                  #{transaction.id}
                </span>
              </div>
              <div className="h-1 w-1 rounded-full bg-muted-foreground" />
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Intl.DateTimeFormat("en-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Jakarta",
                  }).format(new Date(transaction.createdAt))}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
              {transaction.event.title}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3 px-2">
              <Package className="h-5 w-5 text-primary" />
              <div className="space-y-0.5">
                <span className="text-xs text-muted-foreground">Quantity</span>
                <p className="font-medium">{transaction.qty}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2">
              <Banknote className="h-5 w-5 text-primary" />
              <div className="space-y-0.5">
                <span className="text-xs text-muted-foreground">
                  Total Amount
                </span>
                <p className="font-medium">
                  {transaction.totalPrice.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2">
              <Clock className="h-5 w-5 text-primary" />
              <div className="space-y-0.5">
                <span className="text-xs text-muted-foreground">
                  Status Timer
                </span>
                <p className="font-medium">
                  {transaction.status === "UNPAID" &&
                  transaction.totalPrice > 0 ? (
                    <CronTimer transactionId={transaction.id} />
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 lg:min-w-[200px]">
          <Button
            variant="outline"
            disabled
            className={`px-4 py-1.5 h-auto rounded-full text-sm font-semibold capitalize shadow-sm ${getStatusColor(
              transaction.status
            )}`}>
            {transaction.status}
          </Button>

          <div className="flex items-center gap-2">
            {transaction.paymentProof ? (
              <PaymentProofDialog img={transaction.paymentProof} />
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="text-sm text-muted-foreground">
                No Proof
              </Button>
            )}

            {transaction.status !== "DONE" &&
              transaction.status !== "REJECTED" &&
              transaction.status !== "EXPIRED" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 hover:bg-muted transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <TransactionEditDialog
                      id={transaction.id}
                      status={transaction.status}
                      email={transaction.user.email}
                      event={transaction.event}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default TransactionCard;
