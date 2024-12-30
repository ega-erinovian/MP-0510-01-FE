import { CircleAlert } from "lucide-react";
import { FC } from "react";

interface DataNotFoundProps {
  text: string;
}

const DataNotFound: FC<DataNotFoundProps> = ({ text }) => {
  return (
    <div className="h-[480px] w-full flex flex-col items-center justify-center gap-4">
      <CircleAlert className="fill-red-500 text-white w-16 h-16" />
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2">{text}</h2>
      </div>
    </div>
  );
};

export default DataNotFound;
