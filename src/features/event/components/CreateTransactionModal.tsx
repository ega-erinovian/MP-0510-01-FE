import Loading from "@/components/dashboard/Loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useUpdateEvent from "@/hooks/api/event/useUpdateEvent";
import useCreateTransaction from "@/hooks/api/transaction/useCreateTransaction";
import useGetUser from "@/hooks/api/user/useGetUser";
import useUpdateUser from "@/hooks/api/user/useUpdateUser";
import useUpdateVoucher from "@/hooks/api/voucher/useUpdateVoucher";
import { CouponType } from "@/types/coupon";
import { EventType } from "@/types/event";
import { VoucherType } from "@/types/voucher";
import { useFormik } from "formik";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface CreateTransactionModalProps {
  event: EventType;
  voucher: VoucherType[] | CouponType[];
  quantity: number;
  userId: number;
}
const CreateTransactionModal: FC<CreateTransactionModalProps> = ({
  userId,
  event,
  voucher,
  quantity,
}) => {
  const router = useRouter();

  const transactionDate = new Date();
  const [totalPrice, setTotalPrice] = useState(0);

  const [selectedImage, setSelectedImage] = useState<string>("");
  const paymentProofReff = useRef<HTMLInputElement>(null);

  const [isChecked, setIsChecked] = useState(false);

  const handleSwitchChange = (checked: boolean) => {
    setIsChecked(checked);
    console.log("Switch is now:", checked);
  };

  const { data: user, isLoading } = useGetUser(userId);
  const { mutateAsync: createTransaction, isPending } = useCreateTransaction();
  const { mutateAsync: updateEvent } = useUpdateEvent();
  const { mutateAsync: updateUser } = useUpdateUser();
  const { mutateAsync: updateVoucher } = useUpdateVoucher(voucher[0]?.id || 0);

  useEffect(() => {
    let updatedPrice = event.price * quantity;

    if (voucher && voucher.length > 0 && voucher[0]?.amount > 0) {
      const voucherAmount = voucher[0].amount;
      updatedPrice = Math.max(0, updatedPrice - voucherAmount);
    }

    if (isChecked && user) {
      const userPoints = user.point;
      updatedPrice = Math.max(0, updatedPrice - userPoints);
    }

    setTotalPrice(updatedPrice);
  }, [quantity, event.price, voucher, isChecked, user]);

  const formik = useFormik({
    initialValues: {
      paymentProof: null,
    },
    onSubmit: async (values) => {
      try {
        await createTransaction({
          status:
            selectedImage !== "" || totalPrice <= 0 ? "CONFIRMING" : "UNPAID",
          userId: user?.id || 0,
          eventId: event.id,
          paymentProof: values.paymentProof,
          qty: quantity,
          totalPrice,
        });

        await updateEvent({
          id: event.id,
          availableSeats: event.availableSeats - quantity,
        });

        if (user && isChecked) {
          const newPoints =
            user.point <= totalPrice ? 0 : user.point - event.price * quantity;

          const response = await updateUser({
            id: user.id,
            point: newPoints,
          });

          if (!response || response.point !== newPoints) {
            throw new Error(
              "Failed to update user points. Please check the API response."
            );
          }
        }

        if (voucher && voucher.length > 0 && voucher[0]?.amount > 0) {
          await updateVoucher({
            isUsed: true,
          });
        }

        setIsChecked(false);
        router.push(`/events/${event.id}`);
        toast.success("Transaction Created Successfully");
      } catch (error) {
        console.log(error);
      }
    },
  });

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

  if (isLoading) <Loading text="User" />;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-full"
          disabled={user?.id === null || user?.role !== "CUSTOMER"}>
          Reserve A Seats
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Order Confirmation
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="text-sm text-gray-600">
            {new Intl.DateTimeFormat("en-ID", {
              dateStyle: "full",
              timeStyle: "short",
              timeZone: "Asia/Jakarta",
            }).format(transactionDate)}
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="text-sm">
                  {quantity} x {event.title}
                </div>
                <div className="text-sm text-gray-500">
                  {new Intl.DateTimeFormat("en-ID", {
                    dateStyle: "full",
                    timeZone: "Asia/Jakarta",
                  }).format(new Date(event.startDate))}
                </div>
              </div>
              <div className="text-sm">
                {(event.price * quantity).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </div>
            </div>
            {voucher && voucher.length > 0 && voucher[0]?.amount > 0 && (
              <div className="flex justify-between items-start">
                <div className="text-sm">Voucher/Coupon Discount</div>
                <div className="text-sm">
                  -{" "}
                  {voucher[0]?.amount.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </div>
              </div>
            )}
            {user && user.point > 0 && isChecked && (
              <div className="flex justify-between items-start">
                <div className="text-sm">Point</div>
                <div className="text-sm">
                  -{" "}
                  {user.point >= event.price
                    ? (event.price * quantity).toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })
                    : Number(user.point).toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}{" "}
                </div>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="font-medium">Total</div>
              <div className="font-medium">
                {totalPrice.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}{" "}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full mt-4">
          <Label
            htmlFor="terms"
            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
              user && user.point <= 0 && "text-gray-400"
            }`}>
            Use {Number(user?.point).toLocaleString("id-ID")} point
          </Label>
          <Switch
            id="terms"
            checked={isChecked}
            onCheckedChange={handleSwitchChange}
            disabled={user && user.point <= 0}
            className="data-[state=checked]:bg-sky-500 data-[state=checked]:hover:bg-sky-600"
          />
        </div>

        <form onSubmit={formik.handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label className="text-lg font-semibold">Payment Proof</Label>
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

export default CreateTransactionModal;
