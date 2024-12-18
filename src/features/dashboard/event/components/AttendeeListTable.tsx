"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetReviews from "@/hooks/api/review/useGetReviews";
import { TransactionType } from "@/types/transaction";
import { CircleAlert } from "lucide-react";
import { FC } from "react";

interface AttendeeListTableProps {
  title: string;
  attendees: TransactionType[];
  totalPages: number;
  onChangePage: (page: number) => void;
  page: number;
  onChangeTake: (take: number) => void;
  take: number;
}

const AttendeeListTable: FC<AttendeeListTableProps> = ({
  attendees,
  totalPages,
  onChangePage,
  page,
  onChangeTake,
  take,
}) => {
  if (!attendees || attendees.length === 0) {
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
            <TableHead className="font-semibold capitalize">
              Customer Name
            </TableHead>
            <TableHead className="font-semibold capitalize">
              Ticket QTY
            </TableHead>
            <TableHead className="font-semibold capitalize">Rating</TableHead>
            <TableHead className="font-semibold capitalize">Review</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendees.map((attendee, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-medium">
                {attendee.user.fullName}
              </TableCell>
              <TableCell className="font-medium">{attendee.qty}</TableCell>
              <TableCell className="font-medium">
                {
                  attendee.user.reviews.find(
                    (review) => review.eventId === attendee.eventId
                  )?.rating
                }
              </TableCell>
              <TableCell className="font-medium">
                {
                  attendee.user.reviews.find(
                    (review) => review.eventId === attendee.eventId
                  )?.comment
                }
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

export default AttendeeListTable;
