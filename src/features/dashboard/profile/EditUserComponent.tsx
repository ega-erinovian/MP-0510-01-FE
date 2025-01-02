"use client";

import Loading from "@/components/dashboard/Loading";
import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useGetUser from "@/hooks/api/user/useGetUser";
import useUpdateUser from "@/hooks/api/user/useUpdateUser";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { Loader2, Mail, Phone, Trash2, Upload, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { updateUserSchema } from "./schemas";

interface UpdateProfileComponentProps {
  id: number;
}

const UpdateProfileComponent: FC<UpdateProfileComponentProps> = ({ id }) => {
  const router = useRouter();
  const { data: user, isLoading: isUserLoading } = useGetUser(id);
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const profilePictureReff = useRef<HTMLInputElement>(null);

  const [isFormReady, setIsFormReady] = useState(false);
  const formInitialized = useRef(false);

  const formik = useFormik({
    initialValues: {
      id,
      fullName: "",
      email: "",
      profilePicture: null,
      phoneNumber: "",
    },
    validationSchema: updateUserSchema,
    onSubmit: async (values) => {
      try {
        if (values.email === user?.email) {
          await updateUser({
            id,
            fullName: values.fullName,
            profilePicture: values.profilePicture,
            phoneNumber: values.phoneNumber,
          });
        } else {
          await updateUser(values);
        }

        router.push("/dashboard");
        toast.success("User Updated Successfully");
      } catch (error) {
        console.log(error);
      }
    },
  });

  const onChangeProfilePicture = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      formik.setFieldValue("profilePicture", files[0]);
      setSelectedImage(URL.createObjectURL(files[0]));
    }
  };

  const removeProfilePicture = () => {
    formik.setFieldValue("profilePicture", null);
    setSelectedImage("");

    if (profilePictureReff.current) {
      profilePictureReff.current.value = "";
    }
  };

  useEffect(() => {
    if (user && !isUserLoading && !formInitialized.current) {
      // Initialize form with data
      formik.resetForm({
        values: {
          id,
          fullName: user.fullName,
          email: user.email,
          profilePicture: null,
          phoneNumber: user.phoneNumber,
        },
      });

      formInitialized.current = true;
      setIsFormReady(true);
    }
  }, [user, isUserLoading]);

  if (isUserLoading || !isFormReady) {
    return <Loading text="User Data" />;
  }

  return (
    <div className="min-h-screen w-full p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="space-y-4">
              {(selectedImage || user?.profilePicture) && (
                <div className="flex justify-center">
                  <div className="relative group">
                    <img
                      src={selectedImage || user?.profilePicture || ""}
                      alt="Profile"
                      className="h-32 w-32 rounded-full object-cover ring-2 ring-primary/10"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-white hover:text-white hover:bg-black/20"
                        onClick={() => profilePictureReff.current?.click()}>
                        <Upload size={20} />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium">Profile Picture</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      ref={profilePictureReff}
                      type="file"
                      accept="image/*"
                      onChange={onChangeProfilePicture}
                      className="cursor-pointer"
                    />
                  </div>
                  {selectedImage && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={removeProfilePicture}
                      className="shrink-0">
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                label={
                  user?.role === "customer" ? "Full Name" : "Organization Name"
                }
                name="fullName"
                placeholder={`Enter your ${
                  user?.role === "customer" ? "full name" : "organization name"
                }`}
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.fullName}
                touched={formik.touched.fullName}
                icon={<User size={16} />}
              />

              <FormField
                label="Email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.email}
                touched={formik.touched.email}
                icon={<Mail size={16} />}
              />

              <FormField
                label="Phone Number"
                name="phoneNumber"
                placeholder="+628xxxxxxxxxx"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.phoneNumber}
                touched={formik.touched.phoneNumber}
                icon={<Phone size={16} />}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isUpdating}
                className={cn(
                  "min-w-[120px] transition-all duration-200",
                  "hover:translate-y-[-1px] active:translate-y-[1px]"
                )}>
                {isUpdating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateProfileComponent;
