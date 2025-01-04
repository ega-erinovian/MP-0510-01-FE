"use client";

import DataNotFound from "@/components/dashboard/DataNotFound";
import Loading from "@/components/dashboard/Loading";
import useGetReferrals from "@/hooks/api/referral/useGetReferrals";
import useGetUser from "@/hooks/api/user/useGetUser";
import { CheckCircle2, Copy, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import ReferralList from "./ReferralList";

const ReferralListWrapper = () => {
  const { data: sessionData } = useSession();
  const user = sessionData?.user;
  const [copied, setCopied] = useState(false);

  const { data: userData } = useGetUser(Number(user?.id));

  const [page, setPage] = useState<number>(1);
  const [take, setTake] = useState<number>(10);

  const { data, isPending, error } = useGetReferrals({
    page,
    sortBy: "id",
    sortOrder: "desc",
    take,
    userId: Number(user?.id),
  });

  const onChangePage = (page: number) => {
    setPage(page);
  };

  const onChangeTake = (newTake: number) => {
    setTake(newTake);
    setPage(1);
  };

  const copyToClipboard = async () => {
    if (user?.referralCode) {
      try {
        await navigator.clipboard.writeText(user.referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <DataNotFound text="Error fetching referrals" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 py-6 lg:px-8 lg:py-8">
      <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 lg:mb-4">
        Referrals History
      </h1>
      <p className="mb-6 lg:mb-8 text-gray-400">
        Invite your friend using your code, and get points!
      </p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="relative h-full bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 overflow-hidden">
          <div
            className="absolute inset-0 bg-white/5 backdrop-blur-sm"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(147,51,234,0.3) 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative">
            <div className="text-white">
              {isPending ? (
                <div className="py-8">
                  <Loader2 />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-end gap-2">
                    <p className="text-6xl font-bold tracking-tight">
                      {userData?.referralCode}
                    </p>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Copy to clipboard">
                      {copied ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-white/90" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-lg font-medium text-white/90">
                      Your Referral Code
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="relative h-full bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 overflow-hidden">
          <div
            className="absolute inset-0 bg-white/5 backdrop-blur-sm"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(147,51,234,0.3) 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative">
            <div className="text-white">
              {isPending ? (
                <div className="py-8">
                  <Loader2 />
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-6xl font-bold tracking-tight">
                    {userData?.point}
                  </p>
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-lg font-medium text-white/90">
                      Points Accumulated
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="">
        {isPending ? (
          <Loading text="Loading referrals..." />
        ) : (
          <ReferralList
            referrals={data.data}
            totalPages={data.meta.total / take}
            onChangePage={onChangePage}
            page={page}
            onChangeTake={onChangeTake}
            take={take}
          />
        )}
      </div>
    </div>
  );
};

export default ReferralListWrapper;
