import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface EventTableProps {
  events: EventType[];
  sortBy: string;
  sortOrder: string;
  onSortChange: (sortBy: string, sortOrder: string) => void;
  onSearch: (search: string) => void;
  search: string;
  totalPages: number;
  onChangePage: (page: number) => void;
  page: number;
  onChangeTake: (take: number) => void;
  take: number;
  categories: { id: number; name: string }[];
  categoryId: number | undefined;
  onCategoryChange: (categoryId: number | undefined) => void;
}

const EventTable: FC<EventTableProps> = ({
  events,
  sortBy,
  sortOrder,
  search,
  onSortChange,
  onSearch,
  totalPages,
  onChangePage,
  page,
  onChangeTake,
  take,
  categories,
  categoryId,
  onCategoryChange,
}) => {
  const eventTableCols = [
    "id",
    "category",
    "title",
    "start date",
    "end date",
    "city",
    "price",
    "available seats",
    "action",
  ];

  const pages = Array.from({ length: Math.ceil(totalPages) }, (_, i) => i + 1);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex justify-between items-center relative w-96">
          <Input
            value={search}
            placeholder="Search events..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor="sortBy" className="text-lg">
            Sort By:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value, sortOrder)}
            className="border rounded px-2 py-1">
            <option value="id">ID</option>
            <option value="startDate">Start Date</option>
            <option value="endDate">End Date</option>
            <option value="price">Price</option>
            <option value="availableSeats">Available Seats</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(sortBy, e.target.value)}
            className="border rounded px-2 py-1">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div>
          <select
            onChange={(e) =>
              onCategoryChange(Number(e.target.value) || undefined)
            } // Set selected category
            value={categoryId || ""}
            className="p-2 border border-gray-300 rounded">
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {eventTableCols.map((col) => (
              <TableHead key={col}>{col}</TableHead>
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
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link
                      href={`/dashboard/events/event-attendee?id=${event.id}`}>
                      <DropdownMenuItem>Attendee List</DropdownMenuItem>
                    </Link>
                    <Separator />
                    <Link href={`/dashboard/events/edit-event?id=${event.id}`}>
                      <DropdownMenuItem>Edit Event</DropdownMenuItem>
                    </Link>
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

export default EventTable;
