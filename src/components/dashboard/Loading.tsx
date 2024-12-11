import React, { FC } from "react";
import { Loader } from "../ui/loader";

interface LoadingProps {
  text: string;
}

const Loading: FC<LoadingProps> = ({ text }) => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
      <Loader className="h-12 w-12 text-primary" />
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2">Loading {text}...</h2>
      </div>
    </div>
  );
};

export default Loading;
