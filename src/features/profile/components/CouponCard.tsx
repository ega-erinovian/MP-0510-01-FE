"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CouponType } from "@/types/coupon";
import { CheckCircle2, Clock, Coins, Copy } from "lucide-react";
import { useState } from "react";
import { getCouponStatus } from "../const";

const CouponCard = ({ coupon }: { coupon: CouponType }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (coupon.code) {
      try {
        await navigator.clipboard.writeText(coupon.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };
  return (
    <Card className="group transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-foreground">
                    #{coupon.id}
                  </span>
                </div>
                <div className="h-1 w-1 rounded-full bg-muted-foreground" />
              </div>
              <div className="flex items-end gap-2">
                <p className="text-6xl font-bold tracking-tight">
                  {coupon.code}
                </p>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Copy to clipboard">
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3 px-2">
                <Coins className="h-5 w-5 text-primary" />
                <div className="space-y-0.5">
                  <span className="text-xs text-muted-foreground">Amount</span>
                  <p className="font-medium">
                    {coupon.amount.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-2">
                <Clock className="h-5 w-5 text-primary" />
                <div className="space-y-0.5">
                  <span className="text-xs text-muted-foreground">
                    Expires At
                  </span>
                  <p className="font-medium">
                    {new Intl.DateTimeFormat("en-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Asia/Jakarta",
                    }).format(new Date(coupon.expiresAt))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 lg:min-w-[200px]">
            <Button
              variant="outline"
              disabled
              className={`px-4 py-1.5 h-auto rounded-full text-sm font-semibold capitalize shadow-sm ${getCouponStatus(
                coupon.isUsed
              )}`}>
              {coupon.isUsed}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CouponCard;
