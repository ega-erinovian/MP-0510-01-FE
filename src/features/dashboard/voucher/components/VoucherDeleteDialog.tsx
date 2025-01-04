import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useDeleteVoucher from "@/hooks/api/voucher/useDeleteVoucher";
import { FC } from "react";

interface VoucherDeleteDialogProps {
  id: number;
}

const VoucherDeleteDialog: FC<VoucherDeleteDialogProps> = ({ id }) => {
  const { mutateAsync: deleteTransaction, isPending: isPendingDelete } =
    useDeleteVoucher();

  if (isPendingDelete)
    return <p className="m-1 font-semibold text-red-500">Deleting...</p>;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full text-left mt-1" variant="outline">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteTransaction(id)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VoucherDeleteDialog;
