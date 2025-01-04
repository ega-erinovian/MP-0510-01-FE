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
import { Input } from "@/components/ui/input";
import { updateTransactionSchema } from "@/features/dashboard/transaction/schemas";
import useUpdateTransaction from "@/hooks/api/transaction/useUpdateTransaction";
import { useFormik } from "formik";
import { FileImage, Loader2, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, FC, useRef, useState } from "react";
import { toast } from "react-toastify";

interface TransactionEditDialogProps {
  id: number;
  status: string;
  email: string;
  event: { organizer: { fullName: string; bankAccount: string } };
}

const TransactionEditDialog: FC<TransactionEditDialogProps> = ({
  id,
  status,
  email,
  event,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutateAsync: updateTransaction, isPending } = useUpdateTransaction();

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageURL, setImageURL] = useState<string | null>(null);
  const paymentProofRef = useRef<HTMLInputElement>(null);

  const onChangePaymentProof = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      const file = files[0];
      const reader = new FileReader();

      const url = URL.createObjectURL(file);
      setImageURL(url);

      reader.onload = () => {
        formik.setFieldValue("paymentProof", file);
        setSelectedImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const removePaymentProof = () => {
    formik.setFieldValue("paymentProof", null);
    setSelectedImage("");
    setImageURL(null);

    if (paymentProofRef.current) {
      paymentProofRef.current.value = "";
    }
  };

  const formik = useFormik({
    initialValues: {
      id,
      status: status || "UNPAID",
      email: email || "",
      paymentProof: null,
    },
    validationSchema: updateTransactionSchema,
    onSubmit: async (values) => {
      try {
        await updateTransaction({
          ...values,
          status: selectedImage !== "" ? "CONFIRMING" : "UNPAID",
          paymentProof: values.paymentProof,
        });
        setIsDialogOpen(false);
        setSelectedImage("");
        setImageURL(null);
        toast.success("Payment proof uploaded successfully!");
      } catch (error) {
        setSelectedImage("");
        setImageURL(null);
        toast.error("Failed to update transaction. Please try again.");
      }
    },
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full flex items-center gap-2 h-9"
          onClick={() => setIsDialogOpen(true)}
          variant="default">
          <Upload className="h-4 w-4" />
          <span>Upload Payment</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] p-6 rounded-md">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            Upload Payment Proof
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              {imageURL && (
                <div className="p-3 bg-muted/50 rounded-lg mb-4">
                  <Link
                    href={imageURL}
                    target="_blank"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    View Payment Proof
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    ref={paymentProofRef}
                    type="file"
                    accept="image/*"
                    onChange={onChangePaymentProof}
                    className="cursor-pointer file:cursor-pointer"
                  />
                  <Upload className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
                {imageURL && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={removePaymentProof}
                    className="shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            {!!formik.touched.paymentProof && !!formik.errors.paymentProof && (
              <p className="text-sm text-destructive">
                {formik.errors.paymentProof}
              </p>
            )}
          </div>
          <div className="space-y-4">
            <p className="text-base font-semibold">
              Payment Account Information
            </p>
            <div className="p-3 bg-muted/50 rounded-lg space-y-1">
              <p className="text-sm">
                Account Owner: {event.organizer.fullName}
              </p>
              <p className="text-sm">
                Account Number: {event.organizer.bankAccount.split(" ")[1]}
              </p>
              <p className="text-sm">
                Account Bank: {event.organizer.bankAccount.split(" ")[0]}
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={
                isPending ||
                selectedImage === "" ||
                !formik.values.email ||
                !formik.values.status
              }>
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  Uploading...
                </span>
              ) : (
                "Upload Payment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionEditDialog;
