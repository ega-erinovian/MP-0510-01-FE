"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { LoginSchema } from "./schemas";
import useLogin from "@/hooks/api/auth/useLogin";
import Link from "next/link";

const LoginComponent = () => {
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
    <main className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  placeholder="example@mail.com"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {!!formik.touched.email && !!formik.errors.email ? (
                  <p className="text-xs text-red-500">{formik.errors.email}</p>
                ) : null}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  name="password"
                  placeholder="Min 8 - 12 Character"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {!!formik.touched.password && !!formik.errors.password ? (
                  <p className="text-xs text-red-500">
                    {formik.errors.password}
                  </p>
                ) : null}
              </div>
              <Button type="submit" className="mt-4" disabled={isPending}>
                {isPending ? "Loading..." : "Login"}
              </Button>
              <div className="text-center text-xs space-y-2">
                <p>Don't Have Any Account?</p>
                <p>
                  <Link
                    href="/auth/register/customer"
                    className="font-semibold hover:text-sky-500">
                    I Want to Buy Ticket
                  </Link>
                </p>
                <p>
                  <Link
                    href="/auth/register/organizer"
                    className="font-semibold hover:text-sky-500">
                    I Want to Organize Events
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default LoginComponent;
