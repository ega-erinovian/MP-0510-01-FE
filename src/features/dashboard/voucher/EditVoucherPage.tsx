"use client";

import { useFormik } from "formik";
import {
  Calendar,
  Check,
  ChevronsUpDown,
  Coins,
  Loader2,
  Tag,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

// UI Components
import Loading from "@/components/dashboard/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Utils
import { cn } from "@/lib/utils";

// Hooks
import useGetEvents from "@/hooks/api/event/useGetEvents";
import useGetVoucher from "@/hooks/api/voucher/useGetVoucher";
import useUpdateVoucher from "@/hooks/api/voucher/useUpdateVoucher";
import { updateVoucherSchema } from "./schemas";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";

interface EditVoucherPageProps {
  id: string;
}

const DEBOUNCE_DELAY = 500;

const EditVoucherPage = ({ id }: EditVoucherPageProps) => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const user = sessionData?.user;

  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, DEBOUNCE_DELAY);
  const [isFormReady, setIsFormReady] = useState(false);
  const formInitialized = useRef(false);

  const { mutateAsync: updateVoucher, isPending: isUpdating } =
    useUpdateVoucher(Number(id));

  const {
    data: voucher,
    isPending: isVoucherLoading,
    error: voucherError,
  } = useGetVoucher(Number(id));

  const {
    data: events,
    isLoading: isEventsLoading,
    error: eventsError,
  } = useGetEvents({
    search: debouncedSearch,
    userId: Number(user?.id),
  });

  const formik = useFormik({
    enableReinitialize: false,
    initialValues: {
      code: "",
      amount: 0,
      expiresAt: "",
      eventId: 0,
      isUsed: "",
    },
    validationSchema: updateVoucherSchema,
    onSubmit: async (values) => {
      try {
        const formattedExpiresAt = new Date(values.expiresAt).toISOString();
        await updateVoucher({
          ...values,
          expiresAt: formattedExpiresAt,
        });
        router.push("/dashboard/vouchers");
        toast.success("Voucher Updated Successfully");
      } catch (error) {
        console.error("Failed to update voucher: ", error);
        toast.error("Failed to update voucher");
      }
    },
  });

  const handleSelectChange = (value: string) => {
    const isUsedValue = value === "true";
    formik.setFieldValue("isUsed", isUsedValue, true);
  };

  useEffect(() => {
    if (
      voucher &&
      !isVoucherLoading &&
      !isEventsLoading &&
      !formInitialized.current
    ) {
      const formattedDate = new Date(voucher.expiresAt)
        .toISOString()
        .slice(0, 16);
      formik.resetForm({
        values: {
          code: voucher.code,
          amount: voucher.amount,
          expiresAt: formattedDate,
          eventId: voucher.eventId,
          isUsed: voucher.isUsed,
        },
      });

      setSelectedEvent(String(voucher.eventId));
      formInitialized.current = true;
      setIsFormReady(true);
    }
  }, [voucher, isVoucherLoading, isEventsLoading]);

  if (voucherError || eventsError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">
          {voucherError ? "Failed to load voucher" : "Failed to load events"}
        </p>
      </div>
    );
  }

  if (isVoucherLoading || isEventsLoading || !isFormReady) {
    return <Loading text="Voucher Data..." />;
  }

  const showEvents = debouncedSearch.length > 0 && !isEventsLoading;

  return (
    <div className="w-full py-12 px-4 flex items-center justify-center h-full">
      <div className="w-full max-w-[1080px] bg-white rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">Edit Voucher</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-8">
            <div className="space-y-2">
              <Label className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                <Tag size={18} />
                Select Event
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={isUpdating}
                    className="w-full justify-between border-gray-200 focus:border-purple-500 focus:ring-purple-200">
                    {isUpdating
                      ? "Loading..."
                      : voucher
                      ? voucher.event.title
                      : "Select event..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[1015px] p-0" align="start">
                  <div className="border-b px-3 py-2 relative">
                    <input
                      className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {isEventsLoading && debouncedSearch.length > 0 && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />
                    )}
                  </div>
                  <div className="max-h-[200px] overflow-y-auto">
                    {showEvents &&
                      events?.data.map((event: any) => (
                        <button
                          type="button"
                          key={event.id}
                          onClick={() => {
                            setSelectedEvent(event.id.toString());
                            setOpen(false);
                            formik.setFieldValue("eventId", event.id);
                          }}
                          className={cn(
                            "flex w-full items-center justify-between px-3 py-2 hover:bg-accent",
                            selectedEvent === event.id.toString() && "bg-accent"
                          )}>
                          {event.title}
                          {selectedEvent === event.id.toString() && (
                            <Check className="h-4 w-4" />
                          )}
                        </button>
                      ))}
                    {debouncedSearch.length > 0 &&
                      !isEventsLoading &&
                      events?.data?.length === 0 && (
                        <p className="p-4 text-sm text-muted-foreground">
                          No events found.
                        </p>
                      )}
                  </div>
                </PopoverContent>
              </Popover>
              {!!formik.touched.eventId && selectedEvent === "" && (
                <p className="text-sm text-red-500">{formik.errors.eventId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="code"
                className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                <Tag size={18} />
                Voucher Code
              </Label>
              <Input
                id="code"
                name="code"
                placeholder="Enter voucher code"
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isUpdating}
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-200"
              />
              {formik.touched.code && formik.errors.code && (
                <p className="text-sm text-red-500">{formik.errors.code}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="amount"
                className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                <Coins size={18} />
                Amount
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="Enter amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isUpdating}
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-200"
              />
              {formik.touched.amount && formik.errors.amount && (
                <p className="text-sm text-red-500">{formik.errors.amount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="expiresAt"
                className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                <Calendar size={18} />
                Expiration Date
              </Label>
              <Input
                id="expiresAt"
                name="expiresAt"
                type="datetime-local"
                value={formik.values.expiresAt}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isUpdating}
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-200"
              />
              {formik.touched.expiresAt && formik.errors.expiresAt && (
                <p className="text-sm text-red-500">
                  {formik.errors.expiresAt}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="isUsed"
                className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                <Tag size={18} />
                Status
              </Label>
              <Select
                name="isUsed"
                onValueChange={handleSelectChange}
                value={String(formik.values.isUsed)}
                disabled={isUpdating}>
                <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-200">
                  <SelectValue>{formik.values.isUsed}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="USED">Used</SelectItem>
                    <SelectItem value="EXPIRED">Expired</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={isUpdating || !formik.isValid || !formik.dirty}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2.5 rounded-lg font-medium transition-colors">
                {isUpdating ? "Updating..." : "Update Voucher"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVoucherPage;
