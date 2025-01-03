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
        <Button className="w-full text-left mt-1 bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200">
          See Proof
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[850px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-gray-900">
            Payment Proof
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="relative w-full h-[600px] sm:h-[800px] bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={`${
              img ??
              "https://res.cloudinary.com/dpeljv2vu/image/upload/v1734840028/blank-profile-picture-973460_640_enmtle.webp"
            }`}
            alt="payment-proof"
            className="object-contain rounded-lg shadow-lg"
            fill
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200 px-4 py-2 rounded-lg">
            Done
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PaymentProofDialog;
