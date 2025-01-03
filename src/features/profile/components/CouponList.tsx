"use client";

import DataNotFound from "@/components/dashboard/DataNotFound";
import { CouponType } from "@/types/coupon";
import { FC } from "react";
import CouponCard from "./CouponCard";

interface CouponsListProps {
  coupons: CouponType[];
}

const CouponsList: FC<CouponsListProps> = ({ coupons }) => {
  if (!coupons || coupons.length === 0) {
    return <DataNotFound text="No coupons found" />;
  }

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {coupons.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>
    </div>
  );
};

export default CouponsList;
