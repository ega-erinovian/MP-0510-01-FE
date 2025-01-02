"use client";

import DataNotFound from "@/components/dashboard/DataNotFound";
import Loading from "@/components/dashboard/Loading";
import Markdown from "@/components/Markdown";
import QuantitySelector from "@/components/QuantitySelector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useGetEvent from "@/hooks/api/event/useGetEvent";
import useGetVouchers from "@/hooks/api/voucher/useGetVouchers";
import { Calendar, LocateIcon, Share2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import CreateTransactionModal from "./components/CreateTransactionModal";
import useGetCoupons from "@/hooks/api/coupon/useGetCoupons";
import { CouponType } from "@/types/coupon";
import { cn } from "@/lib/utils";
import { VoucherType } from "@/types/voucher";

interface EventDetailComponentProps {
  eventId: number;
}

const EventDetailComponent: FC<EventDetailComponentProps> = ({ eventId }) => {
  const { data } = useSession(); // dari next-auth
  const user = data?.user;

  const { data: event, isLoading: isEventLoading } = useGetEvent(eventId);

  const [quantity, setQuantity] = useState(1);

  const [voucherCode, setVoucherCode] = useState<string>("");
  const [isVoucherValid, setIsVoucherValid] = useState<boolean | null>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [isCouponValid, setIsCouponValid] = useState<boolean | null>(null);
  const [debouncedVoucher] = useDebounce(voucherCode, 500);
  const [debouncedCoupon] = useDebounce(couponCode, 500);
  const [voucherMessage, setVoucherMessage] = useState<string>("");
  const [couponMessage, setCouponMessage] = useState<string>("");
  const { data: existingVoucher, isPending: isPendingVoucher } = useGetVouchers(
    { search: debouncedVoucher, eventId: event?.id, isUsed: "AVAILABLE" }
  );

  const { data: existingCoupon, isPending: isPendingCoupon } = useGetCoupons({
    search: debouncedCoupon,
    userId: user?.id,
  });

  const [voucherData, setVoucherData] = useState<VoucherType[]>([]);
  const [couponData, setCouponData] = useState<CouponType[]>([]);

  useEffect(() => {
    if (!debouncedVoucher || debouncedVoucher === "") {
      setIsVoucherValid(null);
      setVoucherMessage("");
      setVoucherData([]);
      return;
    }

    if (isPendingVoucher) return;

    const isVoucherValid = Array.isArray(existingVoucher?.data)
      ? existingVoucher.data.length > 0
      : !!existingVoucher;
    setIsVoucherValid(isVoucherValid);

    if (isVoucherValid) {
      if (
        existingVoucher?.data[0].isUsed === "EXPIRED" ||
        existingVoucher?.data[0].isUsed === "USED"
      ) {
        setVoucherMessage("Invalid voucher");
        setIsVoucherValid(false);
        setVoucherData([]);
      } else {
        setVoucherMessage("Valid voucher!");
        setVoucherData(existingVoucher?.data || []);
      }
    } else if (debouncedVoucher) {
      setVoucherMessage("Invalid voucher");
      setIsVoucherValid(false);
      setVoucherData([]);
    }
  }, [debouncedVoucher, existingVoucher, isPendingVoucher]);

  useEffect(() => {
    if (!debouncedCoupon || debouncedCoupon === "") {
      setIsCouponValid(null);
      setCouponMessage("");
      setCouponData([]);
      return;
    }

    if (isPendingCoupon) return;

    const isCouponValid = Array.isArray(existingCoupon?.data)
      ? existingCoupon.data.length > 0
      : !!existingCoupon;
    setIsCouponValid(isCouponValid);

    if (isCouponValid) {
      if (
        existingCoupon?.data[0]?.isUsed === "EXPIRED" ||
        existingCoupon?.data[0]?.isUsed === "USED"
      ) {
        setCouponMessage("Invalid coupon");
        setIsCouponValid(false);
        setCouponData([]);
      } else {
        setCouponMessage("Valid coupon!");
        setCouponData(existingCoupon?.data || []);
      }
    } else if (debouncedCoupon) {
      setCouponMessage("Invalid coupon");
      setIsCouponValid(false);
      setCouponData([]);
    }
  }, [debouncedCoupon, existingCoupon, isPendingCoupon]);

  if (isEventLoading) <Loading text="Event Data" />;

  if (!event) {
    return <DataNotFound text="Data Not Found" />;
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 lg:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
          <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-[16/9] w-full overflow-hidden rounded-lg">
            <Image
              src={event.thumbnnail}
              alt={`${event.title} banner`}
              fill
              priority
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw"
            />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {new Intl.DateTimeFormat("en-ID", {
                    dateStyle: "full",
                    timeStyle: "short",
                    timeZone: "Asia/Jakarta",
                  }).format(new Date(event.startDate))}
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                  {event.title}
                </h1>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="shrink-0">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Avatar className="h-12 w-12 border-2 border-background">
                <AvatarImage
                  src="https://res.cloudinary.com/dpeljv2vu/image/upload/v1735294682/ftlh4vmowuyfx3wdqymu.jpg"
                  alt={event.organizer.fullName}
                  className="object-cover"
                />
                <AvatarFallback className="font-medium">
                  {event.organizer.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <p className="text-sm">Organized by</p>
                <p className="font-semibold">{event.organizer.fullName}</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0">
                Visit Profile
              </Button>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Card className="border-zinc-200">
              <CardHeader className="pb-4">
                <h2 className="text-xl font-semibold">Date and Location</h2>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                  <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {new Intl.DateTimeFormat("en-ID", {
                        dateStyle: "full",
                        timeStyle: "short",
                        timeZone: "Asia/Jakarta",
                      }).format(new Date(event.startDate))}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                  <LocateIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {event.address}, {event.city.name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200">
              <CardHeader className="pb-3">
                <h2 className="text-xl font-semibold">About this event</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-zinc max-w-none">
                  <Markdown content={event.description} />
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-sm">
                      {event.category.name}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-zinc-200">
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
                <p className="text-lg font-bold text-purple-600">
                  {event.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    / pax
                  </span>
                </p>
              </div>

              {event.availableSeats > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium">Quantity</p>
                    <QuantitySelector
                      maxValue={event.availableSeats}
                      quantity={quantity}
                      onChangeQuantity={setQuantity}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Input a Voucher"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        disabled={!user || event.price <= 0}
                        className={cn(
                          "w-full transition-colors",
                          isVoucherValid === true && "border-green-500",
                          isVoucherValid === false && "border-red-500"
                        )}
                      />
                      {isPendingVoucher && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          Checking...
                        </span>
                      )}
                    </div>
                    <p
                      className={cn(
                        "text-xs",
                        isVoucherValid === true && "text-green-500",
                        isVoucherValid === false && "text-red-500"
                      )}>
                      {voucherMessage}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Input a Coupon"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={!user || event.price <= 0}
                        className={cn(
                          "w-full transition-colors",
                          isCouponValid === true && "border-green-500",
                          isCouponValid === false && "border-red-500"
                        )}
                      />
                      {isPendingCoupon && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          Checking...
                        </span>
                      )}
                    </div>
                    <p
                      className={cn(
                        "text-xs",
                        isCouponValid === true && "text-green-500",
                        isCouponValid === false && "text-red-500"
                      )}>
                      {couponMessage}
                    </p>
                  </div>

                  <div className="pt-2">
                    {user && (
                      <CreateTransactionModal
                        userId={user.id}
                        event={event}
                        quantity={quantity}
                        voucher={voucherData}
                        coupon={couponData}
                      />
                    )}

                    {!user && (
                      <p className="text-sm text-center text-muted-foreground mt-4">
                        Please{" "}
                        <Link
                          href="/login"
                          className="text-purple-600 hover:text-purple-700 underline underline-offset-2">
                          Login
                        </Link>{" "}
                        to Book Ticket
                      </p>
                    )}

                    {user?.role === "ORGANIZER" && (
                      <p className="text-sm text-center text-muted-foreground mt-4">
                        Please{" "}
                        <Link
                          href="/login"
                          className="text-purple-600 hover:text-purple-700 underline underline-offset-2">
                          Login
                        </Link>{" "}
                        as Customer to Book Ticket
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center bg-red-50 text-red-600 rounded-lg">
                  <p className="font-semibold">Sold Out</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetailComponent;
