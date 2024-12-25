"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { FC } from "react";
import RegisterForm from "./component/RegisterForm";

interface RegisterComponentProps {
  role: string;
}

const RegisterComponent: FC<RegisterComponentProps> = ({ role }) => {
  const convertedRole = role.toUpperCase();

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://img.freepik.com/free-photo/front-view-engaged-crowd-smiley-dj_23-2148325420.jpg?t=st=1735044686~exp=1735048286~hmac=2246d7c534bfff038cda66110b6aefd4ac13e60d81cb080e1b9042fccd5338e5&w=740"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            EventIn.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg">
            <RegisterForm role={convertedRole} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
