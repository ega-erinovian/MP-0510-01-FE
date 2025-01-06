import useLogin from "@/hooks/api/auth/useLogin";
import { useFormik } from "formik";
import React, { useState } from "react";
import { LoginSchema } from "../schemas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  Ticket,
  Calendar,
} from "lucide-react";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: login, isPending } = useLogin();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      await login(values);
    },
  });

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      {/* Header Section */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-semibold flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "pl-4 transition-all duration-200",
                  "border-muted-foreground/20",
                  "focus:border-primary focus:ring-primary",
                  formik.touched.email &&
                    formik.errors.email &&
                    "border-red-500"
                )}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                {formik.errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-sm font-semibold flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline hover:text-primary/90 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "pr-10 transition-all duration-200",
                  "border-muted-foreground/20",
                  "focus:border-primary focus:ring-primary",
                  formik.touched.password &&
                    formik.errors.password &&
                    "border-red-500"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-primary transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                {formik.errors.password}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className={cn(
            "w-full transition-all duration-200",
            "hover:translate-y-[-1px] active:translate-y-[1px]"
          )}
          disabled={isPending}>
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Sign in
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>

      {/* Registration Options */}
      <div className="mt-8 pt-6 border-t space-y-4">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?
          </p>
          <div className="grid gap-2">
            <Link href="/register/customer">
              <Button
                variant="outline"
                className="w-full group hover:border-primary/50">
                <Ticket className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                Sign up to buy tickets
              </Button>
            </Link>
            <Link href="/register/organizer">
              <Button
                variant="outline"
                className="w-full group hover:border-primary/50">
                <Calendar className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                Sign up to organize events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
