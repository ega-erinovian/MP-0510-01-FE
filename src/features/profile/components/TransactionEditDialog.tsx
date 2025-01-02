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
import { useRouter } from "next/navigation";
import { ChangeEvent, FC, useRef, useState } from "react";
import { toast } from "react-toastify";
import { transactionStatus } from "../const";
import Link from "next/link";
import { FileImage, Upload, Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionEditDialogProps {
  id: number;
  status: string;
  email: string;
}

const TransactionEditDialog: FC<TransactionEditDialogProps> = ({
  id,
  status,
  email,
}) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutateAsync: updateTransaction, isPending } = useUpdateTransaction();

  const [selectedImage, setSelectedImage] = useState<string>("");
  const paymentProofRef = useRef<HTMLInputElement>(null);

  const onChangePaymentProof = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      formik.setFieldValue("paymentProof", files[0]);
      setSelectedImage(URL.createObjectURL(files[0]));
    }
  };

  const removePaymentProof = () => {
    formik.setFieldValue("paymentProof", null);
    setSelectedImage("");

    if (paymentProofRef.current) {
      paymentProofRef.current.value = "";
    }
  };

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
          status: selectedImage !== "" ? "CONFIRMING" : "UNPAID",
          paymentProof: values.paymentProof,
        });
        setIsDialogOpen(false);
        toast.success("Payment proof uploaded successfully!");
      } catch (error) {
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
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            Upload Payment Proof
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {selectedImage && (
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 truncate">
                    <p className="text-sm font-medium truncate">
                      Selected Image
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={selectedImage}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                      View
                    </Link>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removePaymentProof}
                      className="h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="relative">
                <Input
                  ref={paymentProofRef}
                  type="file"
                  accept="image/*"
                  onChange={onChangePaymentProof}
                  className={cn(
                    "cursor-pointer file:cursor-pointer",
                    "file:border-0 file:bg-transparent",
                    "file:text-sm file:font-medium",
                    "file:mr-4 file:py-2",
                    "file:text-primary hover:file:text-primary/80"
                  )}
                />
              </div>
              {!!formik.touched.paymentProof &&
                !!formik.errors.paymentProof && (
                  <p className="text-sm text-destructive">
                    {formik.errors.paymentProof}
                  </p>
                )}
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
              disabled={isPending}>
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">◌</span>
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
