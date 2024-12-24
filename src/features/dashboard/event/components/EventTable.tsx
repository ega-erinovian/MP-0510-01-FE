"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EventType } from "@/types/event";
import { CircleAlert, MoreHorizontal } from "lucide-react";
import { FC } from "react";
import { eventTableCols } from "../const";
import AttendeeListDialog from "./AttendeeListDialog";
import EventDeleteDialog from "./EventDeleteDialog";

interface EventsTableProps {
  events: EventType[];
  totalPages: number;
  onChangePage: (page: number) => void;
  page: number;
  onChangeTake: (take: number) => void;
  take: number;
}

const EventsTable: FC<EventsTableProps> = ({
  events,
  totalPages,
  onChangePage,
  page,
  onChangeTake,
  take,
}) => {
  if (!events || events.length === 0) {
    return (
      <div className="h-[50vh] w-full flex flex-col items-center justify-center gap-4">
        <CircleAlert className="fill-red-500 text-white w-16 h-16" />
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Data Not Found</h2>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            {eventTableCols.map((col) => (
              <TableHead key={col} className="font-semibold capitalize">
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.id}</TableCell>
              <TableCell className="font-medium">
                {event.category.name}
              </TableCell>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell className="font-medium">
                {new Intl.DateTimeFormat("en-ID", {
                  dateStyle: "full",
                  timeStyle: "short",
                  timeZone: "Asia/Jakarta",
                }).format(new Date(event.startDate))}
              </TableCell>
              <TableCell className="font-medium">
                {new Intl.DateTimeFormat("en-ID", {
                  dateStyle: "full",
                  timeStyle: "short",
                  timeZone: "Asia/Jakarta",
                }).format(new Date(event.endDate))}
              </TableCell>
              <TableCell className="font-medium">{event.city.name}</TableCell>
              <TableCell className="font-medium">{event.price}</TableCell>
              <TableCell className="font-medium">
                {event.availableSeats}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <AttendeeListDialog id={event.id} title={event.title} />
                    <Separator />
                    <EventDeleteDialog id={event.id} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 flex justify-between items-center">
        {/* Items per page selection */}
        <div>
          <label className="mr-2">Items per page</label>
          <select
            value={take}
            onChange={(e) => onChangeTake(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded">
            {[10, 20, 50].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => onChangePage(page - 1)}
            disabled={page === 1}>
            Previous
          </Button>
          <span className="mx-2">
            Page {page} of {Math.ceil(totalPages)}
          </span>
          <Button
            variant="ghost"
            onClick={() => onChangePage(page + 1)}
            disabled={page === Math.ceil(totalPages)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventsTable;
