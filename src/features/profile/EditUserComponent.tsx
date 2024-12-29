"use client";

import Loading from "@/components/dashboard/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useGetUser from "@/hooks/api/user/useGetUser";
import useUpdateUser from "@/hooks/api/user/useUpdateUser";
import { useFormik } from "formik";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { updateUserSchema } from "./schemas";
import { useDebounce } from "use-debounce";
import useCheckReferral from "@/hooks/api/user/useCheckReferral";
import useCreateReferral from "@/hooks/api/referral/useCreateReferral";
import useCreateCoupon from "@/hooks/api/coupon/useCreateCoupon";
import useRandomCode from "@/hooks/useRandomCode";
import { toast } from "react-toastify";
import CustomerProfileLayout from "./CustomerProfileLayout";

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

  // Referral Code
  const [referralCode, setReferralCode] = useState<string>("");
  const [isReferralValid, setIsReferralValid] = useState<boolean | null>(null);
  const [debouncedReferralCode] = useDebounce(referralCode, 800);
  const [referralMessage, setReferralMessage] = useState<string>("");

  const { data: existingReferral, isPending: isPendingReferral } =
    useCheckReferral(debouncedReferralCode);

  const { mutateAsync: createReferral } = useCreateReferral();
  const { mutateAsync: createCoupon } = useCreateCoupon();

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
    } else if (debouncedReferralCode) {
      setReferralMessage("Invalid referral code");
      formik.setFieldValue("referralCode", "");
      setIsReferralValid(false);
    }
  }, [debouncedReferralCode, existingReferral, isPendingReferral]);

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
      const referralCode = useRandomCode();
      const couponCode = useRandomCode();

      const payload = {
        ...values,
        referralCode: referralCode(),
      };

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

        router.push("/");
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

  if (user) {
    return (
      <CustomerProfileLayout>
        <div className="w-full h-screen flex items-center justify-center">
          <div className="w-[600px]">
            <form onSubmit={formik.handleSubmit}>
              <div className="grid w-full items-center gap-4">
                {(selectedImage || user.profilePicture) && (
                  <div className="w-full flex justify-center">
                    <div className="relative h-[150px] w-[150px]">
                      <img
                        src={
                          selectedImage === ""
                            ? user?.profilePicture || ""
                            : selectedImage
                        }
                        alt="profile-picture-preview"
                        className="object-cover rounded-full w-full h-full"
                      />
                    </div>
                  </div>
                )}
                <div className="grid gap-2">
                  <Label className="text-lg font-semibold">
                    Profile Picture
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      ref={profilePictureReff}
                      type="file"
                      accept="image/*"
                      onChange={onChangeProfilePicture}
                    />
                    {selectedImage && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={removeProfilePicture}
                        className="py-1 px-2 z-50">
                        <Trash2 />
                      </Button>
                    )}
                  </div>
                  {!!formik.touched.profilePicture &&
                  !!formik.errors.profilePicture ? (
                    <p className="text-xs text-red-500">
                      {formik.errors.profilePicture}
                    </p>
                  ) : null}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fullName" className="text-lg font-semibold">
                    {user.role === "customer"
                      ? "Full Name"
                      : "Organization Name"}
                  </Label>
                  <Input
                    name="fullName"
                    placeholder={`Enter your ${
                      user.role === "customer"
                        ? "Full Name"
                        : "Organization Name"
                    }`}
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {!!formik.touched.fullName && !!formik.errors.fullName && (
                    <p className="text-xs text-red-500">
                      {formik.errors.fullName}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-lg font-semibold">
                    Email
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {!!formik.touched.email && !!formik.errors.email && (
                    <p className="text-xs text-red-500">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                {user.referralsUsed.length === 0 && (
                  <div className="grid gap-2">
                    <Label
                      htmlFor="referralCode"
                      className="text-lg font-semibold">
                      Referral Code (optional)
                    </Label>
                    <div className="relative">
                      <Input
                        name="referralCode"
                        type="text"
                        placeholder="Input a referral code if you have one"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        className={`${
                          isReferralValid === true
                            ? "border-green-500"
                            : isReferralValid === false
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {isPendingReferral && (
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                          Checking...
                        </span>
                      )}
                    </div>
                    <p
                      className={`${
                        isReferralValid === true
                          ? "text-green-500"
                          : isReferralValid === false
                          ? "text-red-500"
                          : ""
                      } text-xs`}>
                      {referralMessage}
                    </p>
                  </div>
                )}

                <div className="grid gap-2">
                  <Label
                    htmlFor="phoneNumber"
                    className="text-lg font-semibold">
                    Phone Number
                  </Label>
                  <Input
                    name="phoneNumber"
                    placeholder="+628xxxxxxxxx"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {!!formik.touched.phoneNumber &&
                    !!formik.errors.phoneNumber && (
                      <p className="text-xs text-red-500">
                        {formik.errors.phoneNumber}
                      </p>
                    )}
                </div>

                <div className="flex justify-end items-center w-full">
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Loading..." : "Submit"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </CustomerProfileLayout>
    );
  }
};

export default UpdateProfileComponent;
