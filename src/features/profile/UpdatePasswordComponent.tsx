"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import useResetPassword from "@/hooks/api/auth/useResetPassword";
import { Button } from "@/components/ui/button";
import useUpdateUser from "@/hooks/api/user/useUpdateUser";
import useCheckPassword from "@/hooks/api/auth/useCheckPassword";
import { useDebounce } from "use-debounce";
import { UpdatePasswordSchema } from "./schemas";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CustomerProfileLayout from "./CustomerProfileLayout";

interface UpdatePasswordComponentProps {
  id: number;
}

const UpdatePasswordComponent: FC<UpdatePasswordComponentProps> = ({ id }) => {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState<string>("");
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);
  const [checkPasswordMessage, setCheckPasswordMessage] = useState<string>("");
  const [debouncedOldPassword] = useDebounce(oldPassword, 500);

  const { mutateAsync: checkPassword, isPending: isChecking } =
    useCheckPassword();
  const { mutateAsync: updatePassword, isPending } = useUpdateUser();

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: UpdatePasswordSchema,
    onSubmit: async (values) => {
      await updatePassword({ id, password: values.password });
      toast.success("Password updated successfully");
      router.push("/profile");
    },
  });

  // Handle old password validation with try/catch
  useEffect(() => {
    const validateOldPassword = async () => {
      if (debouncedOldPassword) {
        try {
          const response = await checkPassword({
            id: Number(id),
            password: debouncedOldPassword,
          });

          if (response && response.isValid) {
            setIsPasswordValid(true);
            setCheckPasswordMessage("Password valid");
          } else {
            setIsPasswordValid(false);
            setCheckPasswordMessage("Invalid current password");
          }
        } catch (error) {
          console.error("Error checking password:", error); // Log the error for debugging
          setIsPasswordValid(false);
          setCheckPasswordMessage("Error checking password");
        }
      } else {
        setIsPasswordValid(null); // Reset state if input is empty
        setCheckPasswordMessage("");
      }
    };

    validateOldPassword();
  }, [debouncedOldPassword, checkPassword]);

  return (
    <CustomerProfileLayout>
      <div className="w-full h-full flex items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="oldPassword">Current Password</Label>
                  <Input
                    name="oldPassword"
                    type="password"
                    placeholder="Min 8 - 12 Characters"
                    value={formik.values.oldPassword}
                    onChange={(e) => {
                      formik.handleChange(e);
                      setOldPassword(e.target.value);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {!!formik.touched.oldPassword &&
                  !!formik.errors.oldPassword ? (
                    <p className="text-xs text-red-500">
                      {formik.errors.oldPassword}
                    </p>
                  ) : null}
                  {checkPasswordMessage && (
                    <p
                      className={`text-xs ${
                        isPasswordValid ? "text-green-500" : "text-red-500"
                      }`}>
                      {checkPasswordMessage}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Min 8 - 12 Characters"
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
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    name="confirmPassword"
                    placeholder="Min 8 - 12 Characters"
                    type="password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {!!formik.touched.confirmPassword &&
                  !!formik.errors.confirmPassword ? (
                    <p className="text-xs text-red-500">
                      {formik.errors.confirmPassword}
                    </p>
                  ) : null}
                </div>
                <Button
                  type="submit"
                  className="mt-2"
                  disabled={isPending || !isPasswordValid}>
                  {isPending ? "Loading..." : "Reset Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </CustomerProfileLayout>
  );
};

export default UpdatePasswordComponent;
