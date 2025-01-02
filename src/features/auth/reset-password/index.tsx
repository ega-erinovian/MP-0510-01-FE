"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { FC, useState } from "react";
import { ResetPasswordSchema } from "./schemas";
import useResetPassword from "@/hooks/api/auth/useResetPassword";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, KeyRound, Eye, EyeOff, X } from "lucide-react";
import PasswordInput from "@/components/PasswordInput";

interface ResetPasswordComponentProps {
  token: string;
}

const ResetPasswordComponent: FC<ResetPasswordComponentProps> = ({ token }) => {
  const { mutateAsync: resetPassword, isPending } = useResetPassword(token);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values) => {
      await resetPassword(values);
    },
  });

  return (
    <main className="w-full min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg transform transition-all duration-300 hover:shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <KeyRound className="w-5 h-5" />
            Reset Password
          </CardTitle>
          <CardDescription>
            Enter your new password to reset your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <PasswordInput
              label="New Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.password}
              touched={formik.touched.password}
              showPasswordStrength
            />
            <PasswordInput
              label="Confirm New Password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.confirmPassword}
              touched={formik.touched.confirmPassword}
            />
            <Button
              type="submit"
              className={cn(
                "w-full transition-all duration-200",
                "hover:translate-y-[-1px] active:translate-y-[1px]",
                isPending && "opacity-50 cursor-not-allowed"
              )}
              disabled={isPending}>
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default ResetPasswordComponent;
