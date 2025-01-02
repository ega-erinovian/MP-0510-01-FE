"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Loading from "@/components/dashboard/Loading";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import {
  Calendar,
  Check,
  ChevronsUpDown,
  Coins,
  Loader2,
  Tag,
} from "lucide-react"; // Added Loader2 icon for the loader
import { useState } from "react";
import { CreateVoucherSchema } from "./schemas";
import useCreateVoucher from "@/hooks/api/voucher/useCreateVoucher";
import useGetEvents from "@/hooks/api/event/useGetEvents";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const CreateVoucherPage = () => {
  const { data: sessionData } = useSession();
  const user = sessionData?.user;

  const router = useRouter();
  const { mutateAsync: createVoucher, isPending } = useCreateVoucher();
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 1000);

  const { data: events, isLoading } = useGetEvents({
    search: debouncedSearch.length > 0 ? debouncedSearch : "",
    userId: Number(user?.id),
  });

  const formik = useFormik({
    initialValues: {
      code: "",
      amount: 0,
      expiresAt: "",
      eventId: selectedEvent ? Number(selectedEvent) : 0,
    },
    validationSchema: CreateVoucherSchema,
    onSubmit: async (values) => {
      try {
        const formattedExpiresAt = new Date(values.expiresAt).toISOString();
        await createVoucher({
          ...values,
          expiresAt: formattedExpiresAt,
        });
        toast.success("Voucher Created Successfully");
        router.push("/dashboard/vouchers");
      } catch (error) {
        toast.error("Failed to create voucher");
      }
    },
  });

  const showEvents = debouncedSearch.length > 0 && !isLoading;

  return (
    <div className="w-full py-12 px-4 flex items-center justify-center h-full">
      <div className="w-full max-w-[1080px] bg-white rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">
          Create New Voucher
        </h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-8">
            {/* Event Selection */}
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
                    className="w-full justify-between border-gray-200 focus:border-purple-500 focus:ring-purple-200">
                    {selectedEvent
                      ? events?.data.find(
                          (event: any) => event.id.toString() === selectedEvent
                        )?.title
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
                    {isLoading && debouncedSearch.length > 0 && (
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
                      !isLoading &&
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

            {/* Voucher Code */}
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
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-200"
              />
              {!!formik.touched.code && !!formik.errors.code && (
                <p className="text-sm text-red-500">{formik.errors.code}</p>
              )}
            </div>

            {/* Amount */}
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
                placeholder="Voucher amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-200"
              />
              {!!formik.touched.amount && !!formik.errors.amount && (
                <p className="text-sm text-red-500">{formik.errors.amount}</p>
              )}
            </div>

            {/* Expiration Date */}
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
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-200"
              />
              {!!formik.touched.expiresAt && !!formik.errors.expiresAt && (
                <p className="text-sm text-red-500">
                  {formik.errors.expiresAt}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2.5 rounded-lg font-medium transition-colors">
                {isPending ? "Creating Voucher..." : "Create Voucher"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVoucherPage;
