import { CircleAlert } from "lucide-react";
import { FC } from "react";

interface DataNotFoundProps {
  text: string;
}

const DataNotFound: FC<DataNotFoundProps> = ({ text }) => {
  return (
    <div className="min-h-[480px] w-full flex flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-red-100 animate-ping rounded-full opacity-25" />
          <CircleAlert className="relative fill-red-500 text-white w-20 h-20 animate-pulse" />
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">{text}</h2>
          <p className="text-gray-500">
            The requested data could not be found. Please try again later or
            contact support if the issue persists.
          </p>
        </div>

        <div className="w-24 h-1 bg-gradient-to-r from-red-100 via-red-500 to-red-100 rounded-full opacity-50" />
      </div>
    </div>
  );
};

export default DataNotFound;
