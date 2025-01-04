import { Card, CardContent } from "@/components/ui/card";
import { ReferralType } from "@/types/referrals";
import { Clock, Coins } from "lucide-react";

const ReferralCard = ({ referral }: { referral: ReferralType }) => (
  <Card className="group transition-all hover:shadow-md">
    <CardContent className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-foreground">
                  referral id #{referral.id}
                </span>
                <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                <h3 className="text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                  {referral.refereeUser.fullName}
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3 px-2">
              <Coins className="h-5 w-5 text-primary" />
              <div className="space-y-0.5">
                <span className="text-xs text-muted-foreground">Amount</span>
                <p className="font-medium">
                  + {(10000).toLocaleString("id-ID")} points
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2">
              <Clock className="h-5 w-5 text-primary" />
              <div className="space-y-0.5">
                <span className="text-xs text-muted-foreground">
                  Referred At
                </span>
                <p className="font-medium">
                  {new Intl.DateTimeFormat("en-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Jakarta",
                  }).format(new Date(referral.createdAt))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ReferralCard;
