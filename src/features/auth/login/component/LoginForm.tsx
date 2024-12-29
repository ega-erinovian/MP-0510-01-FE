import useLogin from "@/hooks/api/auth/useLogin";
import { useFormik } from "formik";
import React from "react";
import { LoginSchema } from "../schemas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const LoginForm = () => {
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
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">Login to your account</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-lg font-semibold">
            Email
          </Label>
          <Input
            name="email"
            placeholder="example@mail.com"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="text-lg"
          />
          {!!formik.touched.email && !!formik.errors.email ? (
            <p className="text-xs text-red-500">{formik.errors.email}</p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password" className="text-lg font-semibold">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot Password
            </Link>
          </div>
          <Input
            name="password"
            placeholder="Min 8 - 12 Character"
            type="password"
            className="text-lg"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {!!formik.touched.password && !!formik.errors.password ? (
            <p className="text-xs text-red-500">{formik.errors.password}</p>
          ) : null}
        </div>
        <Button type="submit" className="mt-4 text-lg" disabled={isPending}>
          {isPending ? "Loading..." : "Login"}
        </Button>

        <div className="text-center text-lg space-y-2 mt-8">
          <p>Don't Have Any Account?</p>
          <p>
            <Link
              href="/register/customer"
              className="font-semibold hover:text-sky-500">
              I Want to Buy Ticket
            </Link>
          </p>
          <p>
            <Link
              href="/register/organizer"
              className="font-semibold hover:text-sky-500">
              I Want to Organize Events
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
