"use client";

import DataNotFound from "@/components/dashboard/DataNotFound";
import { ReferralType } from "@/types/referrals";
import { FC } from "react";
import CouponCard from "./CouponCard";
import ReferralCard from "./ReferralCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ReferralListProps {
  referrals: ReferralType[];
  totalPages: number;
  onChangePage: (page: number) => void;
  page: number;
  onChangeTake: (take: number) => void;
  take: number;
}

const ReferralList: FC<ReferralListProps> = ({
  referrals,
  totalPages,
  onChangePage,
  page,
  onChangeTake,
  take,
}) => {
  if (!referrals || referrals.length === 0) {
    return <DataNotFound text="No referrals found" />;
  }

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {referrals.map((referral) => (
          <ReferralCard key={referral.id} referral={referral} />
        ))}
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Items per page</span>
          <Select
            value={take.toString()}
            onValueChange={(value) => onChangeTake(Number(value))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChangePage(page - 1)}
            disabled={page === 1}
            className="h-8">
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {Math.ceil(totalPages)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChangePage(page + 1)}
            disabled={page === Math.ceil(totalPages)}
            className="h-8">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReferralList;
