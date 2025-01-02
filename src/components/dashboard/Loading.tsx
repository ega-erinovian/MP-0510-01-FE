import React, { FC } from "react";
import { Loader } from "../ui/loader";

interface LoadingProps {
  text: string;
}

const Loading: FC<LoadingProps> = ({ text }) => {
  return (
    <div className="h-[50vh] w-full flex flex-col items-center justify-center gap-4 px-4 sm:px-6 md:px-8">
      <Loader className="h-12 w-12 text-primary animate-spin" />
      <div className="text-center">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-700">
          Loading <span className="font-bold text-primary">{text}</span>...
        </h2>
      </div>
    </div>
  );
};

export default Loading;
