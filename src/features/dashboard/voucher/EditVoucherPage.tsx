"use client";

import { useFormik } from "formik";
import { Check, ChevronsUpDown } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Utils
import { cn } from "@/lib/utils";

// Hooks
import useGetEvents from "@/hooks/api/event/useGetEvents";
import useGetVoucher from "@/hooks/api/voucher/useGetVoucher";
import useUpdateVoucher from "@/hooks/api/voucher/useUpdateVoucher";
import { updateVoucherSchema } from "./schemas";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Types
interface Event {
  id: number;
  title: string;
}

interface Voucher {
  id: number;
  code: string;
  amount: number;
  expiresAt: string;
  eventId: number;
  isUsed: boolean;
}

interface FormValues {
  code: string;
  amount: number;
  expiresAt: string;
  eventId: number;
  isUsed: boolean;
}

interface EditVoucherPageProps {
  id: string;
}

// Constants
const DEBOUNCE_DELAY = 500;
const ERROR_MESSAGES = {
  REQUIRED: "This field is required",
  INVALID_AMOUNT: "Amount must be greater than 0",
  INVALID_DATE: "Expiration date must be in the future",
};

const EditVoucherPage = ({ id }: EditVoucherPageProps) => {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, DEBOUNCE_DELAY);
  const [isFormReady, setIsFormReady] = useState(false);
  const formInitialized = useRef(false);

  // API Hooks
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
  });

  const formik = useFormik({
    enableReinitialize: false, // Prevent formik from reinitializing
    initialValues: {
      code: "",
      amount: 0,
      expiresAt: "",
      eventId: 0,
      isUsed: false,
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
      // Format the data
      const formattedDate = new Date(voucher.expiresAt)
        .toISOString()
        .slice(0, 16);

      // Initialize form with data
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

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <form onSubmit={formik.handleSubmit} className="w-full max-w-lg">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Edit Voucher</h1>

          {/* Event Selection */}
          <div className="space-y-1.5">
            <Label>Event</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={isEventsLoading}>
                  {isEventsLoading ? (
                    "Loading events..."
                  ) : (
                    <>
                      {selectedEvent
                        ? events?.data.find(
                            (event: Event) =>
                              event.id.toString() === selectedEvent
                          )?.title
                        : "Select event..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </>
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0" align="start">
                <div className="border-b px-3 py-2">
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-none focus:ring-0"
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {events?.data.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">
                      No events found.
                    </p>
                  ) : (
                    events?.data.map((event: Event) => (
                      <button
                        key={event.id}
                        type="button"
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
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
            {formik.touched.eventId && formik.errors.eventId && (
              <p className="text-xs text-red-500">{formik.errors.eventId}</p>
            )}
          </div>

          {/* Voucher Code */}
          <div className="space-y-1.5">
            <Label htmlFor="code">Voucher Code</Label>
            <Input
              id="code"
              name="code"
              placeholder="Enter voucher code"
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isUpdating}
            />
            {formik.touched.code && formik.errors.code && (
              <p className="text-xs text-red-500">{formik.errors.code}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="Enter amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isUpdating}
            />
            {formik.touched.amount && formik.errors.amount && (
              <p className="text-xs text-red-500">{formik.errors.amount}</p>
            )}
          </div>

          {/* Expiration Date */}
          <div className="space-y-1.5">
            <Label htmlFor="expiresAt">Expiration Date</Label>
            <Input
              id="expiresAt"
              name="expiresAt"
              type="datetime-local"
              value={formik.values.expiresAt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isUpdating}
            />
            {formik.touched.expiresAt && formik.errors.expiresAt && (
              <p className="text-xs text-red-500">{formik.errors.expiresAt}</p>
            )}
          </div>

          {/* Availability Status */}
          <div className="space-y-1.5">
            <Label htmlFor="isUsed">Status</Label>
            <Select
              name="isUsed"
              onValueChange={handleSelectChange}
              value={String(formik.values.isUsed)}
              disabled={isUpdating}>
              <SelectTrigger>
                <SelectValue>
                  {formik.values.isUsed ? "Used" : "Available"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="true">Used</SelectItem>
                  <SelectItem value="false">Available</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isUpdating || !formik.isValid || !formik.dirty}
              className="w-full sm:w-auto">
              {isUpdating ? "Updating..." : "Update Voucher"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditVoucherPage;
