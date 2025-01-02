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
    <div className="group border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4 py-4 px-2">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex justify-center items-center shadow-sm group-hover:scale-105 transition-transform duration-200">
              <TicketCheck className="text-white w-6 h-6" />
            </div>
            <div className="absolute -inset-1 bg-purple-400/20 rounded-xl blur-sm group-hover:bg-purple-400/30 transition-colors duration-200" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400 group-hover:text-purple-500 transition-colors duration-200">
              Transaction #{id.toString().padStart(4, "0")}
            </p>
            <h1 className="text-base font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-200 line-clamp-1">
              {title}
            </h1>
          </div>
        </div>

        <div className="shrink-0">
          <p className="text-sm text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecentSalesItem;
