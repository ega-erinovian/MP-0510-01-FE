"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useRegister from "@/hooks/api/auth/useRegister";
import useGetCitiesByCountry from "@/hooks/api/city/getCitiesByCountry";
import useGetCountries from "@/hooks/api/country/useGetCountries";
import useCreateCoupon from "@/hooks/api/coupon/useCreateCoupon";
import useCreateReferral from "@/hooks/api/referral/useCreateReferral";
import useCheckReferral from "@/hooks/api/user/useCheckReferral";
import useUpdateUser from "@/hooks/api/user/useUpdateUser";
import useRandomCode from "@/hooks/useRandomCode";
import { useFormik } from "formik";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { registerSchema } from "../schemas";

interface RegisterFormProps {
  role: string;
}

const RegisterForm: FC<RegisterFormProps> = ({ role }) => {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string>("");
  const [isReferralValid, setIsReferralValid] = useState<boolean | null>(null);
  const [debouncedReferralCode] = useDebounce(referralCode, 800);
  const [referralMessage, setReferralMessage] = useState<string>("");

  const { data: countries = [] } = useGetCountries();

  const { data: citiesByCountry = [], isLoading: citiesLoading } =
    useGetCitiesByCountry(selectedCountry);

  const { data: existingReferral, isPending: isPendingReferral } =
    useCheckReferral(debouncedReferralCode);

  const { mutateAsync: register, isPending } = useRegister();

  const { mutateAsync: createReferral } = useCreateReferral();
  const { mutateAsync: updateUser } = useUpdateUser();
  const { mutateAsync: createCoupon } = useCreateCoupon();

  const convertedRole = role.toUpperCase();

  useEffect(() => {
    setSelectedCity("");
  }, [selectedCountry]);

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
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      referralCode: null,
      profilePicture: null,
      phoneNumber: "",
      role: convertedRole,
      cityId: null,
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      const referralCode = useRandomCode();
      const couponCode = useRandomCode();

      const payload = {
        ...values,
        cityId: Number(values.cityId) ?? 0,
        referralCode: values.role === "CUSTOMER" ? referralCode() : null,
      };

      try {
        const data = await register(payload);

        if (isReferralValid && data.role === "CUSTOMER") {
          const referrerId = Number(
            Array.isArray(existingReferral) && existingReferral[0]?.id
          );

          const referrerPoints = Number(
            Array.isArray(existingReferral) && existingReferral[0]?.point
          );

          await createReferral({
            referrerUserId: referrerId,
            refereeUserId: Number(data.id),
          });

          await updateUser({
            id: referrerId,
            point: referrerPoints + 10000,
            pointExpired: new Date(
              new Date().setMonth(new Date().getMonth() + 3)
            ),
          });

          await createCoupon({
            userId: Number(data.id),
            code: couponCode(),
            amount: 10000,
            expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 3)),
          });
        }

        router.push("/dashboard/events");
      } catch (error) {
        console.log(error);
      }
    },
  });

  const [selectedImage, setSelectedImage] = useState<string>("");
  const profilePictureReff = useRef<HTMLInputElement>(null);

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

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold capitalize">
          Create {role.toLowerCase()} Account
        </h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          {selectedImage && (
            <div className="w-full flex justify-center">
              <div className="relative h-[150px] w-[150px]">
                <img
                  src={selectedImage}
                  alt="profile-picture-preview"
                  className="object-cover rounded-full w-full h-full"
                />
              </div>
            </div>
          )}
          <Label className="text-lg font-semibold">Profile Picture</Label>
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
          {!!formik.touched.profilePicture && !!formik.errors.profilePicture ? (
            <p className="text-xs text-red-500">
              {formik.errors.profilePicture}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="fullName" className="text-lg font-semibold">
            {role === "customer" ? "Full Name" : "Organization Name"}
          </Label>
          <Input
            name="fullName"
            placeholder={`Enter your ${
              role === "customer" ? "Full Name" : "Organization Name"
            }`}
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {!!formik.touched.fullName && !!formik.errors.fullName && (
            <p className="text-xs text-red-500">{formik.errors.fullName}</p>
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
            <p className="text-xs text-red-500">{formik.errors.email}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password" className="text-lg font-semibold">
            Password
          </Label>
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
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-lg font-semibold">
            Confirm Password
          </Label>
          <Input
            name="confirmPassword"
            placeholder="Min 8 - 12 Character"
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

        {role === "CUSTOMER" && (
          <div className="grid gap-2">
            <Label htmlFor="referralCode" className="text-lg font-semibold">
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

        <div className="grid grid-cols-2 gap-4">
          {/* Country Selection */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="country" className="text-lg font-semibold">
              Country
            </Label>
            <Select
              value={selectedCountry}
              onValueChange={(value) => setSelectedCountry(value)}>
              <SelectTrigger className="w-full text-black">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* City Selection */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="city" className="text-lg font-semibold">
              City
            </Label>
            <Select
              value={selectedCity}
              onValueChange={(value) => {
                const cityId = Number(value);
                if (!isNaN(cityId) && cityId > 0) {
                  setSelectedCity(value); // Keep the selected city ID as a string
                  formik.setFieldValue("cityId", cityId); // Set as a number in Formik
                } else {
                  setSelectedCity(""); // Clear selected city if invalid
                  formik.setFieldValue("cityId", null); // Clear cityId in Formik
                }
              }}
              disabled={!selectedCountry || citiesLoading}>
              <SelectTrigger className="w-full text-black">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {citiesLoading && (
                    <SelectItem value="0" disabled>
                      Loading cities...
                    </SelectItem>
                  )}
                  {citiesByCountry.length > 0 ? (
                    citiesByCountry.map((city) => (
                      <SelectItem key={city.id} value={String(city.id)}>
                        {city.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="-" disabled>
                      No cities available
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        {!!formik.touched.cityId && !!formik.errors.cityId && (
          <p className="text-xs text-red-500">{formik.errors.cityId}</p>
        )}

        <div className="grid gap-2">
          <Label htmlFor="phoneNumber" className="text-lg font-semibold">
            Phone Number
          </Label>
          <Input
            name="phoneNumber"
            placeholder="+628xxxxxxxxx"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {!!formik.touched.phoneNumber && !!formik.errors.phoneNumber && (
            <p className="text-xs text-red-500">{formik.errors.phoneNumber}</p>
          )}
        </div>

        <Input id="role" type="hidden" value={convertedRole!} />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Loading..." : "Submit"}
        </Button>

        <div className="text-center text-lg space-y-2 mt-8">
          Already Have An Account?{" "}
          <Link href="/login" className="font-semibold hover:text-purple-700">
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
