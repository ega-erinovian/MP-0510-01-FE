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
import useDeleteTransaction from "@/hooks/api/transaction/useDeleteTransaction";
import { Loader2 } from "lucide-react";
import { FC } from "react";

interface TransactionDeleteDialogProps {
  id: number;
}

const TransactionDeleteDialog: FC<TransactionDeleteDialogProps> = ({ id }) => {
  const { mutateAsync: deleteTransaction, isPending: isPendingDelete } =
    useDeleteTransaction();

  if (isPendingDelete)
    return <p className="m-1 font-semibold text-red-500">Deleting...</p>;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full text-left mt-1" variant="destructive">
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

export default TransactionDeleteDialog;
