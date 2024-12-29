"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateTransactionSchema } from "@/features/dashboard/transaction/schemas";
import useUpdateTransaction from "@/hooks/api/transaction/useUpdateTransaction";
import { useFormik } from "formik";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FC, useRef, useState } from "react";
import { toast } from "react-toastify";

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
  const paymentProofReff = useRef<HTMLInputElement>(null);

  const onChangePaymentProof = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      // Set the actual file in formik
      formik.setFieldValue("paymentProof", files[0]);
      setSelectedImage(URL.createObjectURL(files[0]));
    }
  };

  const removePaymentProof = () => {
    formik.setFieldValue("paymentProof", null);
    setSelectedImage("");

    if (paymentProofReff.current) {
      paymentProofReff.current.value = "";
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
      } catch (error) {
        toast.error("Failed to update transaction. Please try again.");
      }
    },
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" onClick={() => setIsDialogOpen(true)}>
          Upload Payment Proof
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Payment Proof</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            {selectedImage !== "" && (
              <Link
                href={selectedImage}
                target="_blank"
                className="text-sky-500 underline underline-offset-2 hover:text-sky-600">
                See Payment Proof
              </Link>
            )}
            <div className="flex items-center gap-2">
              <Input
                ref={paymentProofReff}
                type="file"
                accept="image/*"
                onChange={onChangePaymentProof}
              />
              {selectedImage && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={removePaymentProof}
                  className="py-1 px-2 z-50">
                  <Trash2 />
                </Button>
              )}
            </div>
            {!!formik.touched.paymentProof && !!formik.errors.paymentProof ? (
              <p className="text-xs text-red-500">
                {formik.errors.paymentProof}
              </p>
            ) : null}
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Loading..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionEditDialog;
