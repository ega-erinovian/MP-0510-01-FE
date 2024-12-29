import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FC } from "react";

interface TransactionDeleteDialogProps {
  img: string;
}

const PaymentProofDialog: FC<TransactionDeleteDialogProps> = ({ img }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full text-left mt-1" variant="outline">
          See Proof
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Payment Proof</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="relative w-full h-[800px]">
          <Image
            src={`${
              img ??
              "https://res.cloudinary.com/dpeljv2vu/image/upload/v1734840028/blank-profile-picture-973460_640_enmtle.webp"
            }`}
            alt="payment-proof"
            className="object-contain rounded-sm"
            fill
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Done</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PaymentProofDialog;
