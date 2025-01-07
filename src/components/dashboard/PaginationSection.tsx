"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginationMeta } from "@/types/pagination";
import { FC } from "react";

interface PaginationSectionProps extends PaginationMeta {
  onChangePage: (page: number) => void;
}

const PaginationSection: FC<PaginationSectionProps> = ({
  page,
  take,
  total,
  onChangePage,
}) => {
  const handlePrev = () => {
    if (page > 1) {
      onChangePage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < Math.ceil(total / take)) {
      onChangePage(page + 1);
    }
  };

  return (
    <Pagination className="my-12">
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={handlePrev} />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink className="font-bold text-purple-500">
            {page}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext onClick={handleNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationSection;
