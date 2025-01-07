"use client";

import DataNotFound from "@/components/dashboard/DataNotFound";
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
import useCreateCoupon from "@/hooks/api/coupon/useCreateCoupon";
import useCreateReferral from "@/hooks/api/referral/useCreateReferral";
import useCheckReferral from "@/hooks/api/user/useCheckReferral";
import useGetUser from "@/hooks/api/user/useGetUser";
import useUpdateUser from "@/hooks/api/user/useUpdateUser";
import useRandomCode from "@/hooks/useRandomCode";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import {
  CheckCircle2,
  Gift,
  Loader2,
  Mail,
  Phone,
  Trash2,
  Upload,
  User,
  XCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import CustomerProfileLayout from "./CustomerProfileLayout";
import { updateUserSchema } from "./schemas";

const UpdateProfileComponent = () => {
  const router = useRouter();
  const { data } = useSession();
  const id = data?.user.id || 0;
  const { data: user, isLoading: isUserLoading } = useGetUser(id);
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const profilePictureRef = useRef<HTMLInputElement>(null);
  const [isFormReady, setIsFormReady] = useState(false);
  const formInitialized = useRef(false);

  const [referralCode, setReferralCode] = useState<string>("");
  const [isReferralValid, setIsReferralValid] = useState<boolean | null>(null);
  const [debouncedReferralCode] = useDebounce(referralCode, 500);
  const [referralMessage, setReferralMessage] = useState<string>("");

  const { data: existingReferral, isPending: isPendingReferral } =
    useCheckReferral(debouncedReferralCode);
  const { mutateAsync: createReferral } = useCreateReferral();
  const { mutateAsync: createCoupon } = useCreateCoupon();

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
      const couponCode = useRandomCode();

      try {
        if (isReferralValid) {
          const referrerId = Number(
            Array.isArray(existingReferral) && existingReferral[0]?.id
          );
          const referrerPoints = Number(
            Array.isArray(existingReferral) && existingReferral[0]?.point
          );

          await createReferral({
            referrerUserId: referrerId,
            refereeUserId: Number(user?.id),
          });

          await updateUser({
            id: referrerId,
            point: referrerPoints + 10000,
            pointExpired: new Date(
              new Date().setMonth(new Date().getMonth() + 3)
            ),
          });

          await createCoupon({
            userId: Number(user?.id),
            code: couponCode(),
            amount: 10000,
            expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 3)),
          });
        }

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

        router.push("/profile/edit");
        toast.success("Profile Updated Successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to update profile");
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
    if (profilePictureRef.current) {
      profilePictureRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!debouncedReferralCode) {
      setIsReferralValid(null);
      setReferralMessage("");
      return;
    }

    if (isPendingReferral) return;

    const isValid = Array.isArray(existingReferral)
      ? existingReferral.length > 0
      : !!existingReferral;
    setIsReferralValid(isValid);

    if (isValid) {
      setReferralMessage("Valid referral code!");
      formik.setFieldValue("referralCode", debouncedReferralCode);
    } else {
      setReferralMessage("Invalid referral code");
      formik.setFieldValue("referralCode", "");
      setIsReferralValid(false);
    }
  }, [debouncedReferralCode, existingReferral, isPendingReferral]);

  useEffect(() => {
    if (user && !isUserLoading && !formInitialized.current) {
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
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading text="Profile Data" />
      </div>
    );
  }

  if (!user) return <DataNotFound text="Error fetching your data" />;

  return (
    <CustomerProfileLayout>
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
                {(selectedImage || user.profilePicture) && (
                  <div className="flex justify-center">
                    <div className="relative group">
                      <img
                        src={selectedImage || user.profilePicture || ""}
                        alt="Profile"
                        className="h-32 w-32 rounded-full object-cover ring-2 ring-primary/10"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-white hover:text-white hover:bg-black/20"
                          onClick={() => profilePictureRef.current?.click()}>
                          <Upload size={20} />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Profile Picture
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        ref={profilePictureRef}
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

              {/* Form Fields */}
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  label={
                    user.role === "customer" ? "Full Name" : "Organization Name"
                  }
                  name="fullName"
                  placeholder={`Enter your ${
                    user.role === "customer" ? "full name" : "organization name"
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

                {user.referralsUsed.length === 0 && (
                  <div className="grid gap-2">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Gift size={16} />
                      Referral Code (optional)
                    </Label>
                    <div className="relative">
                      <Input
                        name="referralCode"
                        placeholder="Enter referral code"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        className={cn(
                          "transition-all duration-200",
                          isReferralValid === true && "border-green-500",
                          isReferralValid === false && "border-red-500"
                        )}
                      />
                      {isPendingReferral && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2
                            size={16}
                            className="animate-spin text-muted-foreground"
                          />
                        </div>
                      )}
                    </div>
                    {referralMessage && (
                      <p
                        className={cn(
                          "text-xs flex items-center gap-1",
                          isReferralValid ? "text-green-500" : "text-red-500"
                        )}>
                        {isReferralValid ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <XCircle size={12} />
                        )}
                        {referralMessage}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={
                    isUpdating || isReferralValid === false || isPendingReferral
                  }
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
    </CustomerProfileLayout>
  );
};

export default UpdateProfileComponent;
