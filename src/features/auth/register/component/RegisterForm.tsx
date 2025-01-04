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
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import {
  CheckCircle,
  DollarSign,
  Eye,
  EyeOff,
  Gift,
  Globe,
  IdCard,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Trash2,
  Upload,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
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

  // Bank Account
  const [cardNum, setCardNum] = useState<string>("");
  const [bank, setBank] = useState<string>("");
  const bankAccount = `${bank} ${cardNum}`;

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

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

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
      bankAccount: null,
      profilePicture: null,
      phoneNumber: "",
      role: convertedRole,
      cityId: null,
    },
    validationSchema: registerSchema,
    enableReinitialize: false,
    onSubmit: async (values) => {
      const referralCode = useRandomCode();
      // Generate the coupon code first and immediately invoke it
      const newCouponCode = useRandomCode()();

      const payload = {
        ...values,
        cityId: Number(values.cityId) ?? 0,
        referralCode: values.role === "CUSTOMER" ? referralCode() : null,
        bankAccount: values.role === "ORGANIZER" ? bankAccount : null,
      };

      try {
        const data = await register(payload);
        const newUserId = Number(data.id);
        const threeMonthsAhead = new Date(
          new Date().setMonth(new Date().getMonth() + 3)
        );

        if (
          isReferralValid &&
          Array.isArray(existingReferral) &&
          existingReferral[0]
        ) {
          const referrerId = Number(existingReferral[0].id);
          const referrerPoints = Number(existingReferral[0].point);

          try {
            await createReferral({
              referrerUserId: referrerId,
              refereeUserId: newUserId,
            });

            await updateUser({
              id: referrerId,
              point: referrerPoints + 10000,
              pointExpired: threeMonthsAhead,
            });

            await createCoupon({
              userId: newUserId,
              code: newCouponCode,
              amount: 10000,
              expiresAt: threeMonthsAhead,
            });

            console.log("Referral process completed");
          } catch (error) {
            console.error("Error in referral process:", error);
            toast.error("Failed to process referral benefits");
            return;
          }
        }

        setIsReferralValid(false);
        toast.success("Register Success");
        router.push("/login");
      } catch (error) {
        console.error("Registration error:", error);
        toast.error("Registration failed");
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

  const onChangeCardNumber = (query: string) => {
    setCardNum(query);
  };

  const onChangeBank = (query: string) => {
    setBank(query);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight capitalize">
            Create {role.toLowerCase()} Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill in your details to create your account
          </p>
        </div>

        {/* Profile Picture Section */}
        <div className="space-y-4">
          {selectedImage && (
            <div className="flex justify-center">
              <div className="relative group">
                <img
                  src={selectedImage}
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
            <Label className="text-sm font-medium flex items-center gap-2">
              <User size={16} />
              Profile Picture
            </Label>
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

        {/* Form Fields */}
        <div className="grid gap-6">
          {/* Personal Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-sm font-medium flex items-center gap-2">
                <User size={16} />
                {role === "CUSTOMER" ? "Full Name" : "Organization Name"}
              </Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder={`Enter your ${
                  role === "CUSTOMER" ? "full name" : "organization name"
                }`}
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "transition-all duration-200",
                  "border-muted-foreground/20",
                  formik.touched.fullName &&
                    formik.errors.fullName &&
                    "border-red-500"
                )}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <XCircle size={12} />
                  {formik.errors.fullName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phoneNumber"
                className="text-sm font-medium flex items-center gap-2">
                <Phone size={16} />
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="+628xxxxxxxxxx"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "transition-all duration-200",
                  "border-muted-foreground/20",
                  formik.touched.phoneNumber &&
                    formik.errors.phoneNumber &&
                    "border-red-500"
                )}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <XCircle size={12} />
                  {formik.errors.phoneNumber}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium flex items-center gap-2">
              <Mail size={16} />
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={cn(
                "transition-all duration-200",
                "border-muted-foreground/20",
                formik.touched.email && formik.errors.email && "border-red-500"
              )}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <XCircle size={12} />
                {formik.errors.email}
              </p>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium flex items-center gap-2">
                <Lock size={16} />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 - 12 characters"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn(
                    "pr-10 transition-all duration-200",
                    "border-muted-foreground/20",
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
                  <XCircle size={12} />
                  {formik.errors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium flex items-center gap-2">
                <Lock size={16} />
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Min 8 - 12 characters"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn(
                    "pr-10 transition-all duration-200",
                    "border-muted-foreground/20",
                    formik.touched.confirmPassword &&
                      formik.errors.confirmPassword &&
                      "border-red-500"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-primary transition-colors">
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <XCircle size={12} />
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>
          </div>

          {/* Location Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="country"
                className="text-sm font-medium flex items-center gap-2">
                <Globe size={16} />
                Country
              </Label>
              <Select
                value={selectedCountry}
                onValueChange={setSelectedCountry}>
                <SelectTrigger className="border-muted-foreground/20">
                  <SelectValue placeholder="Select country" />
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

            <div className="space-y-2">
              <Label
                htmlFor="city"
                className="text-sm font-medium flex items-center gap-2">
                <MapPin size={16} />
                City
              </Label>
              <Select
                value={selectedCity}
                onValueChange={(value) => {
                  const cityId = Number(value);
                  if (!isNaN(cityId) && cityId > 0) {
                    setSelectedCity(value);
                    formik.setFieldValue("cityId", cityId);
                  } else {
                    setSelectedCity("");
                    formik.setFieldValue("cityId", null);
                  }
                }}
                disabled={!selectedCountry || citiesLoading}>
                <SelectTrigger className="border-muted-foreground/20">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {citiesLoading ? (
                      <SelectItem value="0" disabled>
                        <span className="flex items-center gap-2">
                          <Loader2 size={14} className="animate-spin" />
                          Loading cities...
                        </span>
                      </SelectItem>
                    ) : citiesByCountry.length > 0 ? (
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

          {role === "ORGANIZER" && (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-2">
                <Label
                  htmlFor="cardNumber"
                  className="text-sm font-medium flex items-center gap-2">
                  <IdCard size={16} />
                  Account Number
                </Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  type="text"
                  placeholder="9 digits of your account number"
                  value={cardNum}
                  onChange={(e) => onChangeCardNumber(e.target.value)}
                  className={cn(
                    "transition-all duration-200",
                    "border-muted-foreground/20",
                    formik.touched.email &&
                      formik.errors.email &&
                      "border-red-500"
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="bank"
                  className="text-sm font-medium flex items-center gap-2">
                  <DollarSign size={16} />
                  Bank
                </Label>
                <Input
                  id="bank"
                  name="bank"
                  type="text"
                  placeholder="Your Bank"
                  value={bank}
                  onChange={(e) => onChangeBank(e.target.value)}
                  className={cn(
                    "transition-all duration-200",
                    "border-muted-foreground/20",
                    formik.touched.email &&
                      formik.errors.email &&
                      "border-red-500"
                  )}
                />
              </div>
            </div>
          )}

          {/* Referral Code */}
          {role === "CUSTOMER" && (
            <div className="space-y-2">
              <Label
                htmlFor="referralCode"
                className="text-sm font-medium flex items-center gap-2">
                <Gift size={16} />
                Referral Code (optional)
              </Label>
              <div className="relative">
                <Input
                  id="referralCode"
                  name="referralCode"
                  placeholder="Enter referral code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className={cn(
                    "transition-all duration-200",
                    "border-muted-foreground/20",
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
                    <CheckCircle size={12} />
                  ) : (
                    <XCircle size={12} />
                  )}
                  {referralMessage}
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={
              isPending || isReferralValid === false || isPendingReferral
            }
            className={cn(
              "w-full transition-all duration-200",
              "hover:translate-y-[-1px] active:translate-y-[1px]"
            )}>
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>

          {/* Login Link */}
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground">
              Already have an account?
            </p>
            <Link
              href="/login"
              className="text-sm font-semibold text-primary hover:underline">
              Sign in to your account
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
