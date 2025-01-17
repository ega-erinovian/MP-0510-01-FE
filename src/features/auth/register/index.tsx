"use client";

import { Ticket } from "lucide-react";
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
          src="/register-bg.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-700 text-primary-foreground">
              <Ticket className="size-4" color="#fafafa" />
            </div>
            EventIn.
          </div>
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
