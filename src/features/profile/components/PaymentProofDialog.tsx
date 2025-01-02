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
import { FileImage } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

interface PaymentProofDialogProps {
  img: string;
}

const PaymentProofDialog: FC<PaymentProofDialogProps> = ({ img }) => {
  const fallbackImage =
    "https://res.cloudinary.com/dpeljv2vu/image/upload/v1734840028/blank-profile-picture-973460_640_enmtle.webp";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 h-9">
          <FileImage className="h-4 w-4" />
          <span>View Proof</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-4xl w-[calc(100%-2rem)] p-6">
        <AlertDialogHeader className="mb-4">
          <AlertDialogTitle className="text-xl font-semibold">
            Payment Proof
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="relative w-full overflow-hidden rounded-lg bg-muted">
          <div className="aspect-[3/4] sm:aspect-[4/3] md:aspect-[16/9] w-full relative">
            <Image
              src={img ?? fallbackImage}
              alt="Payment proof"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              priority
            />
          </div>
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel asChild>
            <Button variant="secondary" className="w-full sm:w-auto">
              Close
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PaymentProofDialog;
