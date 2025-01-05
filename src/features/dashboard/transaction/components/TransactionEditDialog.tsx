import { FC, useState, useCallback } from "react";
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

  const { mutateAsync: updateTransaction } = useUpdateTransaction();
  const { mutateAsync: updateEvent } = useUpdateEvent();
  const { mutateAsync: updateVoucher } = useUpdateVoucher(
    transaction.voucherId || 0
  );
  const { mutateAsync: updateCoupon } = useUpdateCoupon(
    transaction.couponId || 0
  );
  const { mutateAsync: updateUser } = useUpdateUser();
  const { data: existingVoucher } = useGetVoucher(transaction.voucherId || 0);
  const { data: existingCoupon } = useGetCoupon(transaction.couponId || 0);

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
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { status } = values;

        // Conditional logic for status change
        if (["REJECTED", "EXPIRED", "CANCELED"].includes(status)) {
          await updateEvent({
            id: transaction.eventId,
            availableSeats: transaction.event.availableSeats + transaction.qty,
          });

          if (transaction.voucherId) {
            await updateVoucher({ isUsed: "AVAILABLE" });
          }

          if (transaction.couponId) {
            await updateCoupon({ isUsed: "AVAILABLE" });
          }

          const totalPriceBeforePoint =
            transaction.event.price * transaction.qty;
          let usedPoint = 0;

          if (transaction.isUsePoint) {
            const adjustedPrice =
              totalPriceBeforePoint -
              (existingVoucher?.amount || 0) -
              (existingCoupon?.amount || 0);
            usedPoint = adjustedPrice - transaction.totalPrice;
          }

          if (usedPoint > 0) {
            await updateUser({
              id: transaction.userId,
              point: transaction.user.point + usedPoint,
            });
          }
        }

        await updateTransaction({
          ...values,
          voucherId: ["REJECTED", "EXPIRED", "CANCELED"].includes(status)
            ? null
            : values.voucherId,
          couponId: ["REJECTED", "EXPIRED", "CANCELED"].includes(status)
            ? null
            : values.couponId,
        });

        toast.success("Transaction updated successfully.");
        router.push("/dashboard/transactions");
        setIsDialogOpen(false);
      } catch (error) {
        console.error("Error updating transaction:", error);
        toast.error("Failed to update transaction. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      setIsDialogOpen(open);
      if (!open) {
        formik.resetForm();
      }
    },
    [formik]
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full">Update</Button>
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
              disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
              className="w-full sm:w-auto">
              {formik.isSubmitting ? "Updating..." : "Update Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionEditDialog;
