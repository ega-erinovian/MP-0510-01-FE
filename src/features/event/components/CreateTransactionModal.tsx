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
import useUpdateCoupon from "@/hooks/api/coupon/useUpdateCoupon";
import useUpdateEvent from "@/hooks/api/event/useUpdateEvent";
import useCreateTransaction from "@/hooks/api/transaction/useCreateTransaction";
import useGetUser from "@/hooks/api/user/useGetUser";
import useUpdateUser from "@/hooks/api/user/useUpdateUser";
import useUpdateVoucher from "@/hooks/api/voucher/useUpdateVoucher";
import { cn } from "@/lib/utils";
import { CouponType } from "@/types/coupon";
import { EventType } from "@/types/event";
import { VoucherType } from "@/types/voucher";
import { useFormik } from "formik";
import { Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface CreateTransactionModalProps {
  event: EventType;
  voucher: VoucherType[];
  coupon: CouponType[];
  quantity: number;
  userId: number;
}
const CreateTransactionModal: FC<CreateTransactionModalProps> = ({
  userId,
  event,
  voucher,
  coupon,
  quantity,
}) => {
  const router = useRouter();

  const transactionDate = new Date();
  const [totalPrice, setTotalPrice] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string>("");
  const paymentProofReff = useRef<HTMLInputElement>(null);

  const [isChecked, setIsChecked] = useState(false);

  const handleSwitchChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  const { data: user, isLoading } = useGetUser(userId);
  const { mutateAsync: createTransaction, isPending } = useCreateTransaction();
  const { mutateAsync: updateEvent, isPending: isUpdatingEvent } =
    useUpdateEvent();
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUser();

  const { mutateAsync: updateVoucher, isPending: isUpdatingVoucher } =
    useUpdateVoucher(voucher[0]?.id || 0);
  const { mutateAsync: updateCoupon, isPending: isUpdatingCoupon } =
    useUpdateCoupon(coupon[0]?.id || 0);

  useEffect(() => {
    let updatedPrice = event.price * quantity;

    if (voucher && voucher.length > 0 && voucher[0].amount > 0) {
      const voucherAmount = voucher[0].amount;
      updatedPrice = Math.max(0, updatedPrice - voucherAmount);
    }

    if (coupon && coupon.length > 0 && coupon[0].amount > 0) {
      const couponAmount = coupon[0].amount;
      updatedPrice = Math.max(0, updatedPrice - couponAmount);
    }

    if (isChecked && user) {
      const userPoints = user.point;
      updatedPrice = Math.max(0, updatedPrice - userPoints);
    }

    setTotalPrice(updatedPrice);
  }, [quantity, event.price, voucher, coupon, isChecked, user]);

  const formik = useFormik({
    initialValues: {
      paymentProof: null,
    },
    onSubmit: async (values) => {
      try {
        const voucherId = voucher[0]?.id;
        const couponId = coupon[0]?.id;

        if (!isPending) {
          await updateEvent({
            id: event.id,
            availableSeats: event.availableSeats - quantity,
          });

          if (user && isChecked) {
            const newPoints =
              user.point <= totalPrice
                ? 0
                : user.point - event.price * quantity;

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

          if (voucher && voucher.length > 0 && voucher[0].amount > 0) {
            await updateVoucher({
              isUsed: "USED",
            });
          }

          if (coupon && coupon.length > 0 && coupon[0].amount > 0) {
            await updateCoupon({
              isUsed: "USED",
            });
          }
        }

        await createTransaction({
          status:
            selectedImage !== "" || totalPrice <= 0 ? "CONFIRMING" : "UNPAID",
          userId: user?.id || 0,
          eventId: event.id,
          paymentProof: values.paymentProof,
          qty: quantity,
          totalPrice,
          voucherId,
          couponId,
          isUsePoint: isChecked,
        });

        setIsChecked(false);
        setSelectedImage("");
        toast.success("Transaction Created Successfully");
        router.push(`/events/${event.id}`);
      } catch (error) {
        console.log(error);
      } finally {
        setIsOpen(false);
      }
    },
  });

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

    if (paymentProofReff.current) {
      paymentProofReff.current.value = "";
    }
  };

  if (isLoading) <Loading text="User" />;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "w-full transition-colors font-semibold",
            user?.role !== "CUSTOMER" &&
              "bg-gray-100 hover:bg-gray-200 text-gray-500"
          )}
          size="lg"
          onClick={() => setIsOpen(true)}
          disabled={user?.id === null || user?.role !== "CUSTOMER"}>
          Reserve A Seat
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] p-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-bold tracking-tight">
            Order Confirmation
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {new Intl.DateTimeFormat("en-ID", {
              dateStyle: "full",
              timeStyle: "short",
              timeZone: "Asia/Jakarta",
            }).format(transactionDate)}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
              <div className="space-y-1.5">
                <p className="font-medium">
                  {quantity} x {event.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Intl.DateTimeFormat("en-ID", {
                    dateStyle: "full",
                    timeZone: "Asia/Jakarta",
                  }).format(new Date(event.startDate))}
                </p>
              </div>
              <p className="font-medium shrink-0">
                {(event.price * quantity).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </p>
            </div>

            {/* Discounts Section */}
            <div className="space-y-2">
              {voucher && voucher.length > 0 && voucher[0]?.amount > 0 && (
                <div className="flex justify-between items-center py-2">
                  <p className="text-sm">Voucher Discount</p>
                  <p className="text-sm text-green-600">
                    -{" "}
                    {voucher[0]?.amount.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </p>
                </div>
              )}

              {coupon && coupon.length > 0 && coupon[0]?.amount > 0 && (
                <div className="flex justify-between items-center py-2">
                  <p className="text-sm">Coupon Discount</p>
                  <p className="text-sm text-green-600">
                    -{" "}
                    {coupon[0]?.amount.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </p>
                </div>
              )}

              {user && user.point > 0 && isChecked && (
                <div className="flex justify-between items-center py-2">
                  <p className="text-sm">Point Discount</p>
                  <p className="text-sm text-green-600">
                    -{" "}
                    {(user.point >= event.price
                      ? event.price * quantity
                      : user.point
                    ).toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Total Price */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Total</p>
              <p className="text-lg font-semibold text-purple-600">
                {totalPrice.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </p>
            </div>
          </div>

          {/* Points Toggle */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <Label
              htmlFor="use-points"
              className={cn(
                "text-sm font-medium cursor-pointer",
                ((user && user.point <= 0) || event.price <= 0) &&
                  "text-muted-foreground"
              )}>
              Use {Number(user?.point).toLocaleString("id-ID")} points
            </Label>
            <Switch
              id="use-points"
              checked={isChecked}
              onCheckedChange={handleSwitchChange}
              disabled={(user && user.point <= 0) || event.price <= 0}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>

          {/* Payment Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Label
                className={cn(
                  "text-base font-semibold",
                  event.price <= 0 && "text-muted-foreground"
                )}>
                Payment Proof
              </Label>

              {selectedImage && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <Link
                    href={selectedImage}
                    target="_blank"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    View Payment Proof
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    ref={paymentProofReff}
                    type="file"
                    accept="image/*"
                    onChange={onChangePaymentProof}
                    disabled={event.price <= 0}
                    className="cursor-pointer file:cursor-pointer"
                  />
                  <Upload className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
                {selectedImage && (
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

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={
                isPending ||
                isUpdatingEvent ||
                isUpdatingUser ||
                isUpdatingVoucher ||
                isUpdatingCoupon
              }>
              {isPending ||
              isUpdatingEvent ||
              isUpdatingUser ||
              isUpdatingVoucher ||
              isUpdatingCoupon
                ? "Processing..."
                : "Confirm Order"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionModal;
