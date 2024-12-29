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
  const [debouncedVoucherCoupon] = useDebounce(voucherCode, 800);
  const [referralMessage, setReferralMessage] = useState<string>("");
  const { data: existingVoucher, isPending: isPendingVoucher } = useGetVouchers(
    { search: debouncedVoucherCoupon, eventId: event?.id }
  );
  const { data: existingCoupon, isPending: isPendingCoupon } = useGetCoupons({
    search: debouncedVoucherCoupon,
    userId: user?.id,
  });

  const [voucherData, setVoucherData] = useState<VoucherType[]>([]);

  useEffect(() => {
    if (!debouncedVoucherCoupon || debouncedVoucherCoupon === "") {
      setIsVoucherValid(null);
      setReferralMessage("");
      setVoucherData([]);
      return;
    }

    if (isPendingVoucher) return;

    const isValid = Array.isArray(existingVoucher?.data)
      ? existingVoucher.data.length > 0
      : !!existingVoucher;
    setIsVoucherValid(isValid);

    if (isValid) {
      setReferralMessage("Valid voucher!");
      setVoucherData(existingVoucher?.data || []);
    } else if (debouncedVoucherCoupon) {
      setReferralMessage("Invalid voucher");
      setIsVoucherValid(false);
      setVoucherData([]);
    }
  }, [debouncedVoucherCoupon, existingVoucher, isPendingVoucher]);

  if (isEventLoading) <Loading text="Event Data" />;

  if (!event) {
    return <DataNotFound text="Data Not Found" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Banner Image */}
          <div className="relative h-[480px] w-full overflow-hidden rounded-lg">
            <Image
              src={event.thumbnnail}
              alt="thumbnail"
              fill
              className="object-cover duration-100 hover:scale-105"
            />
          </div>

          {/* Event Title & Actions */}
          <div className="my-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {new Intl.DateTimeFormat("en-ID", {
                    dateStyle: "full",
                    timeStyle: "short",
                    timeZone: "Asia/Jakarta",
                  }).format(new Date(event.startDate))}
                </p>
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Organizer */}
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src="https://res.cloudinary.com/dpeljv2vu/image/upload/v1735294682/ftlh4vmowuyfx3wdqymu.jpg"
                  alt="profile-picture"
                  className="object-cover"
                />
                <AvatarFallback>{event.organizer.fullName}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  By{" "}
                  <span className="font-semibold">
                    {event.organizer.fullName}
                  </span>
                </p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Visit Profile
              </Button>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-8">
            {/* Date and Location */}
            <Card>
              <CardHeader className="pb-4">
                <h2 className="text-xl font-semibold">Date and time</h2>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="flex items-center gap-4">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
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
                <div className="flex items-center gap-4">
                  <LocateIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {event.address}, {event.city.name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader className="pb-3">
                <h2 className="text-xl font-semibold">About this event</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <Markdown content={event.description} />

                {/* Tags */}
                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{event.category.name}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6 grid gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {event.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}{" "}
                  / pax
                </p>
              </div>

              {event.availableSeats > 0 ? (
                <>
                  <div className="flex justify-between items-center w-full">
                    <p>Quantity</p>
                    <QuantitySelector
                      maxValue={event.availableSeats}
                      quantity={quantity}
                      onChangeQuantity={setQuantity}
                    />
                  </div>

                  <div className="grid gap-2">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Input a Voucher or Coupon"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        disabled={!user}
                        className={`${
                          isVoucherValid === true
                            ? "border-green-500"
                            : isVoucherValid === false
                            ? "border-red-500"
                            : ""
                        } w-full`}
                      />
                      {isPendingVoucher && (
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                          Checking...
                        </span>
                      )}
                    </div>
                    <p
                      className={`${
                        isVoucherValid === true
                          ? "text-green-500"
                          : isVoucherValid === false
                          ? "text-red-500"
                          : ""
                      } text-xs`}>
                      {referralMessage}
                    </p>
                  </div>

                  <div>
                    {user && (
                      <CreateTransactionModal
                        userId={user.id}
                        event={event}
                        quantity={quantity}
                        voucher={voucherData}
                      />
                    )}

                    {!user ? (
                      <p className="text-sm text-muted-foreground text-center mt-2">
                        Please{" "}
                        <Link
                          href={"/login"}
                          className="text-sky-500 underline underline-offset-2 hover:text-sky-600">
                          Login
                        </Link>{" "}
                        to Book Ticket
                      </p>
                    ) : null}

                    {user?.role === "ORGANIZER" ? (
                      <p className="text-sm text-muted-foreground text-center mt-2">
                        Please{" "}
                        <Link
                          href={"/login"}
                          className="text-sky-500 underline underline-offset-2 hover:text-sky-600">
                          Login
                        </Link>{" "}
                        as Customer to Book Ticket
                      </p>
                    ) : null}
                  </div>
                </>
              ) : (
                <p className="text-gray-400">Sold Out</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetailComponent;
