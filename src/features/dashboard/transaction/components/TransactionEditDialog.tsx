import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useUpdateEvent from "@/hooks/api/event/useUpdateEvent";
import useUpdateTransaction from "@/hooks/api/transaction/useUpdateTransaction";
import useUpdateUser from "@/hooks/api/user/useUpdateUser";
import useGetVoucher from "@/hooks/api/voucher/useGetVoucher";
import useUpdateVoucher from "@/hooks/api/voucher/useUpdateVoucher";
import { TransactionType } from "@/types/transaction";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { transactionStatus } from "../const";
import { updateTransactionSchema } from "../schemas";
import useGetCoupon from "@/hooks/api/coupon/useGetCoupon";
import useUpdateCoupon from "@/hooks/api/coupon/useUpdateCoupon";

interface TransactionEditDialogProps {
  transaction: TransactionType;
}

const TransactionEditDialog: FC<TransactionEditDialogProps> = ({
  transaction,
}) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutateAsync: updateTransaction, isPending: isUpdatingTransaction } =
    useUpdateTransaction();
  const { mutateAsync: updateEvent, isPending: isUpdatingEvent } =
    useUpdateEvent();
  const { mutateAsync: updateVoucher } = useUpdateVoucher(
    transaction.voucherId || 0
  );

  const { mutateAsync: updateCoupon } = useUpdateCoupon(
    transaction.couponId || 0
  );

  const { mutateAsync: updateUser } = useUpdateUser();

  const { data: existingVoucher, isPending: isPendingVoucher } = useGetVoucher(
    transaction.voucherId || 0
  );

  const { data: existingCoupon, isPending: isPendingCoupon } = useGetCoupon(
    transaction.couponId || 0
  );

  const formik = useFormik({
    initialValues: {
      id: transaction.id,
      status: transaction.status,
      email: transaction.user.email,
      paymentProof: null,
      voucherId: transaction.voucherId ?? null,
      couponId: transaction.couponId ?? null,
    },
    validationSchema: updateTransactionSchema,
    onSubmit: async (values) => {
      try {
        if (
          (values.status === "REJECTED" ||
            values.status === "EXPIRED" ||
            values.status === "CANCELED") &&
          !isUpdatingTransaction
        ) {
          await updateEvent({
            id: transaction.eventId,
            availableSeats: transaction.event.availableSeats + transaction.qty,
          });

          if (transaction.voucherId) {
            await updateVoucher({
              isUsed: "AVAILABLE",
            });
          }

          if (transaction.couponId) {
            await updateCoupon({
              isUsed: "AVAILABLE",
            });
          }

          let totalPriceBeforePoint = transaction.event.price * transaction.qty;
          let usedPoint = 0;

          if (transaction.isUsePoint) {
            if (existingVoucher) {
              totalPriceBeforePoint -= existingVoucher.amount;
            }

            if (existingCoupon) {
              totalPriceBeforePoint -= existingCoupon.amount;
            }

            usedPoint = totalPriceBeforePoint - transaction.totalPrice;
          }

          if (transaction.totalPrice < totalPriceBeforePoint) {
            await updateUser({
              id: transaction.userId,
              point: transaction.user.point + usedPoint,
            });
          }
        }

        if (
          values.status === "REJECTED" ||
          values.status === "EXPIRED" ||
          values.status === "CANCELED"
        ) {
          await updateTransaction({
            ...values,
            voucherId: null,
            couponId: null,
          });
        } else {
          await updateTransaction({
            ...values,
          });
        }

        setIsDialogOpen(false);
        router.push("/dashboard/transactions");
      } catch (error) {
        toast.error("Failed to update transaction. Please try again.");
      }
    },
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" onClick={() => setIsDialogOpen(true)}>
          Update
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Payment Status</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} noValidate>
          <Select
            value={formik.values.status}
            onValueChange={(value) => formik.setFieldValue("status", value)}
            aria-describedby="status-helper-text">
            <SelectTrigger className="w-[180px]">
              <SelectValue className="capitalize">
                {formik.values.status}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {transactionStatus.map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className="capitalize">
                    {status}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {formik.touched.status && formik.errors.status && (
            <p id="status-helper-text" className="text-xs text-red-500">
              {formik.errors.status}
            </p>
          )}

          <DialogFooter className="mt-8">
            <Button
              type="submit"
              disabled={
                isUpdatingTransaction || !formik.isValid || !formik.dirty
              }
              className="w-full sm:w-auto">
              {isUpdatingTransaction ? "Updating..." : "Update Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionEditDialog;
