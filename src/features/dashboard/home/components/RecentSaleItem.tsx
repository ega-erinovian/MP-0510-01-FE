import { TicketCheck } from "lucide-react";
import { FC } from "react";
import { formatDistanceToNow } from "date-fns";

interface RecentSalesProps {
  id: number;
  title: string;
  createdAt: Date;
}

const RecentSalesItem: FC<RecentSalesProps> = ({ id, title, createdAt }) => {
  return (
    <div className="border-b-2 border-b-gray-200 flex items-baseline justify-between gap-4 py-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-600 flex justify-center items-center">
          <TicketCheck className="text-white text-xl w-8 h-8" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400">Transaction#{id}</p>
          <h1 className="text-md font-bold text-gray-800">{title}</h1>
        </div>
      </div>
      <div>
        <p className="text-xs text-gray-400">
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

export default RecentSalesItem;
