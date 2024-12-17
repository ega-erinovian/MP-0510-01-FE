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
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"; // Added Loader2 icon for the loader
import { useState } from "react";
import { CreateVoucherSchema } from "./schemas";
import useCreateVoucher from "@/hooks/api/voucher/useCreateVoucher";
import useGetEvents from "@/hooks/api/event/useGetEvents";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";

const CreateVoucherPage = () => {
  const router = useRouter();
  const { mutateAsync: createVoucher, isPending } = useCreateVoucher();
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 1000); // Debounce for 1 second

  // Fetch events only if searchQuery has finished typing (after debounce)
  const { data: events, isLoading } = useGetEvents({
    search: debouncedSearch.length > 0 ? debouncedSearch : "", // Trigger fetch only after debounce
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
      const formattedExpiresAt = new Date(values.expiresAt).toISOString();
      await createVoucher({
        ...values,
        expiresAt: formattedExpiresAt,
      });
      router.push("/dashboard/vouchers");
    },
  });

  // Don't render events or search results until debounceSearch has finished
  const showEvents = debouncedSearch.length > 0 && !isLoading;

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <form onSubmit={formik.handleSubmit}>
        <div className="grid w-[500px] items-center gap-6">
          <h1 className="text-3xl font-bold">Create A Voucher</h1>
          <div className="flex flex-col space-y-1.5">
            <Label>Event</Label>
            <Popover open={open} onOpenChange={setOpen}>
              {isPending && searchQuery !== "" ? (
                <PopoverTrigger asChild disabled={true}>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between">
                    Searching Event...
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
              ) : (
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between">
                    {selectedEvent
                      ? events?.data.find(
                          (event: any) => event.id.toString() === selectedEvent
                        )?.title
                      : "Select event..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
              )}

              <PopoverContent className="w-[500px] p-0" align="start">
                <div className="border-b px-3 py-2 relative">
                  <input
                    className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {/* Loader Spinner */}
                  {isLoading && debouncedSearch.length > 0 && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />
                  )}
                </div>
                <div>
                  {debouncedSearch.length > 0 &&
                    !isLoading &&
                    events?.data?.length === 0 && (
                      <p className="p-4 text-sm text-muted-foreground">
                        No events found.
                      </p>
                    )}
                  {showEvents &&
                    events?.data.map((event: any) => (
                      <button
                        name="eventId"
                        type="button"
                        key={event.id}
                        onClick={() => {
                          setSelectedEvent(event.id.toString());
                          setOpen(false);
                          formik.setFieldValue("eventId", event.id); // Update Formik field
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
                </div>
              </PopoverContent>
            </Popover>
            {!!formik.touched.eventId && selectedEvent === "" ? (
              <p className="text-xs text-red-500">{formik.errors.eventId}</p>
            ) : null}
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="code">Code</Label>
            <Input
              name="code"
              placeholder="Voucher code"
              type="text"
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              id="code"
            />
            {!!formik.touched.code && !!formik.errors.code && (
              <p className="text-xs text-red-500">{formik.errors.code}</p>
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="amount">Amount</Label>
            <Input
              name="amount"
              placeholder="Voucher amount"
              type="number"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              id="amount"
            />
            {!!formik.touched.amount && !!formik.errors.amount && (
              <p className="text-xs text-red-500">{formik.errors.amount}</p>
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="expiresAt">Expires At</Label>
            <Input
              name="expiresAt"
              placeholder="Voucher expiration date"
              type="datetime-local"
              value={formik.values.expiresAt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              id="expiresAt"
            />
            {!!formik.touched.expiresAt && !!formik.errors.expiresAt && (
              <p className="text-xs text-red-500">{formik.errors.expiresAt}</p>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <Button type="submit" className="mt-4" disabled={isPending}>
              {isPending ? "Loading..." : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateVoucherPage;
