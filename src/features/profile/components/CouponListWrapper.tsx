"use client";

import DataNotFound from "@/components/dashboard/DataNotFound";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";
import useGetCoupons from "@/hooks/api/coupon/useGetCoupons";
import { useSession } from "next-auth/react";
import CouponsList from "./CouponList";

const CouponListWrapper = () => {
  const { data: sessionData } = useSession();
  const user = sessionData?.user;

  const { data, isPending, error } = useGetCoupons({
    userId: Number(user?.id),
  });

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <DataNotFound text="Error fetching coupons" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 py-6 lg:px-8 lg:py-8">
      <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 lg:mb-4">
        Your Coupons
      </h1>
      <p className="mb-6 lg:mb-8 text-gray-400">
        Input your friends referral code to get coupons! (Your used coupons will
        not be shown here)
      </p>

      <div className="">
        {isPending ? (
          <ProfileSkeleton dataQty={3} />
        ) : (
          <CouponsList coupons={data.data} />
        )}
      </div>
    </div>
  );
};

export default CouponListWrapper;
