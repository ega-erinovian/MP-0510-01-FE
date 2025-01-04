"use client";

import PasswordInput from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useCheckPassword from "@/hooks/api/auth/useCheckPassword";
import useUpdateUser from "@/hooks/api/user/useUpdateUser";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { Check, KeyRound, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import { UpdatePasswordSchema } from "./schemas";

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
      router.push("/dashboard");
    },
  });

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
          console.error("Error checking password:", error);
          setIsPasswordValid(false);
          setCheckPasswordMessage("Error checking password");
        }
      } else {
        setIsPasswordValid(null);
        setCheckPasswordMessage("");
      }
    };

    validateOldPassword();
  }, [debouncedOldPassword, checkPassword]);

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg transform transition-all duration-300 hover:shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <KeyRound className="w-5 h-5" />
            Reset Password
          </CardTitle>
          <CardDescription>
            Change your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <PasswordInput
              label="Current Password"
              name="oldPassword"
              value={formik.values.oldPassword}
              onChange={(e) => {
                formik.handleChange(e);
                setOldPassword(e.target.value);
              }}
              onBlur={formik.handleBlur}
              error={formik.errors.oldPassword}
              touched={formik.touched.oldPassword}
            />
            {checkPasswordMessage && !isChecking ? (
              <div
                className={cn(
                  "text-sm flex items-center gap-1.5 p-2 rounded transition-colors",
                  isPasswordValid
                    ? "text-green-500 bg-green-500/10"
                    : "text-red-500 bg-red-500/10"
                )}>
                {isPasswordValid ? <Check size={14} /> : <X size={14} />}
                {checkPasswordMessage}
              </div>
            ) : (
              <div
                className={cn(
                  "text-sm flex items-center gap-1.5 p-2 rounded transition-colors bg-gray-200 text-gray-500"
                )}>
                <Loader2 className="animate-spin" /> Checking Current Password
              </div>
            )}
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
                (isPending || !isPasswordValid) &&
                  "opacity-50 cursor-not-allowed"
              )}
              disabled={isPending || !isPasswordValid}>
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePasswordComponent;
