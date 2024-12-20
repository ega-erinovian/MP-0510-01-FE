"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useRouter } from "next/navigation";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { registerSchema } from "./schemas";

interface RegisterComponentProps {
  role: string;
}

const RegisterComponent: FC<RegisterComponentProps> = ({ role }) => {
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
    <div className="w-screen h-screen flex items-center justify-center">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle className="capitalize text-2xl">
            Create {role} Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="fullName">
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
                  <p className="text-xs text-red-500">
                    {formik.errors.fullName}
                  </p>
                )}
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
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

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {!!formik.touched.password && !!formik.errors.password && (
                  <p className="text-xs text-red-500">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              {role === "customer" && (
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="referralCode">Referral Code (optional)</Label>
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

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phoneNumber">Phone Number</Label>
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

              <div className="grid grid-cols-2 gap-4">
                {/* Country Selection */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="country">Country</Label>
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
                  <Label htmlFor="city">City</Label>
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

              {selectedImage && (
                <>
                  <div className="relative h-[150px] w-[200px]">
                    <img
                      src={selectedImage}
                      alt="profile-picture-preview"
                      className="object-cover rounded w-full h-full"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={removeProfilePicture}
                      className="absolute top-0 -right-10 py-1 px-2 z-50">
                      <Trash2 />
                    </Button>
                  </div>
                </>
              )}

              <div className="flex flex-col space-y-1.5">
                <Label>Profile Picture</Label>
                <Input
                  ref={profilePictureReff}
                  type="file"
                  accept="image/*"
                  onChange={onChangeProfilePicture}
                />
                {!!formik.touched.profilePicture &&
                !!formik.errors.profilePicture ? (
                  <p className="text-xs text-red-500">
                    {formik.errors.profilePicture}
                  </p>
                ) : null}
              </div>

              <Input id="role" type="hidden" value={convertedRole!} />

              <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Loading..." : "Submit"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterComponent;
