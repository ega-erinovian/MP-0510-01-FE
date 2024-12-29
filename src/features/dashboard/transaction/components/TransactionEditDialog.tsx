"use client";

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
import { FC, useState, useCallback } from "react";
import { transactionStatus } from "../const";
import { useFormik } from "formik";
import { updateTransactionSchema } from "../schemas";
import useUpdateTransaction from "@/hooks/api/transaction/useUpdateTransaction";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import useUpdateEvent from "@/hooks/api/event/useUpdateEvent";
import useGetTransactions from "@/hooks/api/transaction/useGetTransactions";

interface TransactionEditDialogProps {
  id: number;
  status: string;
  email: string;
  eventId: number;
  qty: number;
  availableSeats: number;
}

const TransactionEditDialog: FC<TransactionEditDialogProps> = ({
  id,
  status,
  email,
  eventId,
  qty,
  availableSeats,
}) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutateAsync: updateTransaction, isPending: isUpdating } =
    useUpdateTransaction();
  const { mutateAsync: updateEvent, isPending: isUpdatingEvent } =
    useUpdateEvent();

  const formik = useFormik({
    initialValues: {
      id,
      status,
      email,
      paymentProof: null,
    },
    validationSchema: updateTransactionSchema,
    onSubmit: async (values) => {
      try {
        await updateTransaction({
          ...values,
        });

        if (
          values.status === "REJECTED" ||
          values.status === "EXPIRED" ||
          values.status === "CANCELED"
        ) {
          await updateEvent({
            id: eventId,
            availableSeats: availableSeats + qty,
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
              disabled={isUpdating || !formik.isValid || !formik.dirty}
              className="w-full sm:w-auto">
              {isUpdating ? "Updating..." : "Update Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionEditDialog;
