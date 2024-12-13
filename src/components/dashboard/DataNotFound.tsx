import React, { FC } from "react";
import { Loader } from "../ui/loader";
import { CircleAlert } from "lucide-react";
import { Button } from "../ui/button";

interface DataNotFoundProps {
  text: string;
  resetSearch: (search: string) => void;
}

const DataNotFound: FC<DataNotFoundProps> = ({ text, resetSearch }) => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
      <CircleAlert className="fill-red-500 text-white w-16 h-16" />
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2">{text}</h2>
      </div>
      <Button onClick={(e) => resetSearch("")}>Go Back</Button>
    </div>
  );
};

export default DataNotFound;
