"use client";

import RichTextEditor from "@/components/dashboard/RichTextEditor";
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
import useGetCategories from "@/hooks/api/category/useGetCategories";
import useGetCities from "@/hooks/api/city/useGetCities";
import useGetCountries from "@/hooks/api/country/useGetCountries";
import useCreateEvent, {
  CreateEventPayload,
} from "@/hooks/api/event/useCreateEvent";
import { formatISO } from "date-fns";
import { useFormik } from "formik";
import {
  Calendar,
  Check,
  Coins,
  Globe,
  Loader2,
  MapPin,
  Tag,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { createEventSchema } from "./schemas";
import { useDebounce } from "use-debounce";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const CreateEventComponent = () => {
  const { data } = useSession(); // dari next-auth
  const user = data?.user;

  const router = useRouter();
  const { mutateAsync: createEvent, isPending: isUpdating } = useCreateEvent();

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const [searchCity, setSearchCity] = useState("");
  const [debouncedSearchCity] = useDebounce(searchCity, 1000);
  const [open, setOpen] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const { data: countries = [] } = useGetCountries();

  const { data: cities, isPending: isPendingCities } = useGetCities({
    search: debouncedSearchCity.length > 0 ? debouncedSearchCity : "",
    countryId: parseInt(selectedCountry),
  });

  const showCities = debouncedSearchCity.length > 0 && !isPendingCities;

  const { data: categories = [] } = useGetCategories();

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const thumbnailReff = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedCity("");
  }, [selectedCountry]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      address: "",
      price: 0,
      availableSeats: 0,
      thumbnnail: null,
      startDate: "",
      endDate: "",
      categoryId: 0,
      cityId: 0,
      userId: 0,
    },
    validationSchema: createEventSchema,
    onSubmit: async (values) => {
      try {
        const payload: CreateEventPayload = {
          title: values.title,
          description: values.description,
          address: values.address,
          price: values.price,
          availableSeats: values.availableSeats,
          thumbnnail: values.thumbnnail,
          startDate: formatISO(new Date(values.startDate)),
          endDate: formatISO(new Date(values.endDate)),
          categoryId: values.categoryId,
          cityId: values.cityId,
          userId: user?.id!,
        };

        await createEvent(payload);

        router.push("/dashboard/events");
        toast.success("Event Created Successfullly");
      } catch (error) {
        console.log(error);
      }
    },
  });

  const onChangeThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      formik.setFieldValue("thumbnnail", files[0]);
      setSelectedImage(URL.createObjectURL(files[0]));
    }
  };

  const removeThumbnail = () => {
    formik.setFieldValue("profilePicture", null);
    setSelectedImage("");

    if (thumbnailReff.current) {
      thumbnailReff.current.value = "";
    }
  };

  return (
    <div className="w-full py-12 px-4 flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-[1080px] bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">
          Create New Event
        </h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-8">
            {/* Image Preview */}
            {selectedImage && (
              <div className="w-full">
                <div className="relative h-[480px] w-full overflow-hidden rounded-xl shadow-md">
                  <Image
                    src={selectedImage}
                    alt="thumbnail"
                    fill
                    className="object-cover duration-300 hover:scale-105"
                  />
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div className="p-6 border border-dashed border-purple-200 rounded-lg bg-purple-50/50 space-y-3">
              <Label className="text-lg font-semibold flex items-center gap-2 text-purple-700">
                <Upload size={20} />
                Event Thumbnail
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  ref={thumbnailReff}
                  type="file"
                  accept="image/*"
                  onChange={onChangeThumbnail}
                  className="bg-white border-purple-100 focus:border-purple-500 focus:ring-purple-200 hover:cursor-pointer"
                />
                {selectedImage && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={removeThumbnail}
                    className="py-1 px-2 hover:bg-red-600 transition-colors">
                    <Trash2 />
                  </Button>
                )}
              </div>
              {!!formik.touched.thumbnnail && !!formik.errors.thumbnnail && (
                <p className="text-sm text-red-500">
                  {formik.errors.thumbnnail}
                </p>
              )}
            </div>

            {/* Title & Address */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                  <Tag size={18} />
                  Event Title
                </Label>
                <Input
                  name="title"
                  placeholder="Your event title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                />
                {!!formik.touched.title && !!formik.errors.title && (
                  <p className="text-sm text-red-500">{formik.errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="address"
                  className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                  <MapPin size={18} />
                  Event Address
                </Label>
                <textarea
                  name="address"
                  placeholder="Your event address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full min-h-[100px] rounded-lg border border-gray-200 p-3 focus:border-purple-500 focus:ring-purple-200 outline-none"
                />
                {!!formik.touched.address && !!formik.errors.address && (
                  <p className="text-sm text-red-500">
                    {formik.errors.address}
                  </p>
                )}
              </div>
            </div>

            {/* Seats & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="availableSeats"
                  className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                  <Users size={18} />
                  Available Seats
                </Label>
                <Input
                  type="number"
                  name="availableSeats"
                  placeholder="Total seats of the event"
                  value={formik.values.availableSeats}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                />
                {!!formik.touched.availableSeats &&
                  !!formik.errors.availableSeats && (
                    <p className="text-sm text-red-500">
                      {formik.errors.availableSeats}
                    </p>
                  )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="price"
                  className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                  <Coins size={18} />
                  Event Price
                </Label>
                <Input
                  type="number"
                  name="price"
                  placeholder="Price of the ticket"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                />
                {!!formik.touched.price && !!formik.errors.price && (
                  <p className="text-sm text-red-500">{formik.errors.price}</p>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="startDate"
                  className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                  <Calendar size={18} />
                  Start Date & Time
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formik.values.startDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                  disabled={isUpdating}
                />
                {!!formik.touched.startDate && !!formik.errors.startDate && (
                  <p className="text-sm text-red-500">
                    {formik.errors.startDate as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="endDate"
                  className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                  <Calendar size={18} />
                  End Date & Time
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formik.values.endDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                  disabled={isUpdating}
                />
                {!!formik.touched.endDate && !!formik.errors.endDate && (
                  <p className="text-sm text-red-500">
                    {formik.errors.endDate as string}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="grid md:grid-cols-2 gap-4 w-ful">
              <div className="space-y-2">
                <Label
                  htmlFor="country"
                  className="text-lg font-semibold flex items-center gap-2 text-gray-700">
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
                        <SelectItem key={country.id} value={String(country.id)}>
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
                  className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                  <MapPin size={16} />
                  City
                </Label>
                <div className="flex items-center gap-2">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={isPendingCities || selectedCountry === ""}
                        className="w-full h-10 justify-between">
                        {isPendingCities && searchCity !== "" ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Searching...
                          </span>
                        ) : selectedCity ? (
                          cities?.find(
                            (city: any) => city.id.toString() === selectedCity
                          )?.name
                        ) : (
                          "Search City"
                        )}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-full p-0" align="start">
                      <div className="flex items-center border-b p-2">
                        <Input
                          className="border-0 focus-visible:ring-0 text-sm"
                          placeholder="Search city..."
                          value={searchCity}
                          disabled={isPendingCities || selectedCountry === ""}
                          onChange={(e) => {
                            setSearchCity(e.target.value);
                          }}
                        />
                      </div>
                      <div className="max-h-[200px] overflow-y-auto">
                        {showCities && cities?.length === 0 ? (
                          <p className="p-3 text-sm text-muted-foreground">
                            No cities found.
                          </p>
                        ) : (
                          showCities &&
                          cities?.map((city) => (
                            <button
                              key={city.id}
                              onClick={() => {
                                const cityId = Number(city.id);
                                if (!isNaN(cityId) && cityId > 0) {
                                  setSelectedCity(city.id.toString());
                                  formik.setFieldValue("cityId", cityId);
                                } else {
                                  setSelectedCity("");
                                  formik.setFieldValue("cityId", null);
                                }
                                setOpen(false);
                              }}
                              className={cn(
                                "w-full px-3 py-2 text-sm text-left hover:bg-accent transition-colors",
                                selectedCity === city.id.toString() &&
                                  "bg-accent"
                              )}>
                              <div className="flex items-center justify-between">
                                <span>{city.name}</span>
                                {selectedCity === city.id.toString() && (
                                  <Check className="h-4 w-4" />
                                )}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                  {selectedCity && (
                    <Button
                      onClick={() => {
                        setSelectedCity("");
                        setSearchCity("");
                      }}
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50">
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {!!formik.touched.cityId && !!formik.errors.cityId && (
              <p className="text-sm text-red-500">{formik.errors.cityId}</p>
            )}

            {/* Category */}
            <div className="space-y-2">
              <Label
                htmlFor="categories"
                className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                <Tag size={18} />
                Event Category
              </Label>
              <Select
                value={selectedCategory}
                onValueChange={(value: string) => {
                  setSelectedCategory(value);
                  formik.setFieldValue("categoryId", Number(value));
                }}>
                <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-200">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-auto">
                  <SelectGroup>
                    {categories.map(
                      (category: { id: number; name: string }) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {!!formik.touched.categoryId && !!formik.errors.categoryId && (
                <p className="text-sm text-red-500">
                  {formik.errors.categoryId}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-lg font-semibold text-gray-700">
                Event Description
              </Label>
              <RichTextEditor
                label="description"
                value={formik.values.description}
                onChange={(value: string) =>
                  formik.setFieldValue("description", value)
                }
                isTouch={formik.touched.description}
                setError={formik.setFieldError}
                setTouch={formik.setFieldTouched}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={isUpdating}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2.5 rounded-lg font-medium transition-colors">
                {isUpdating ? "Creating Event..." : "Create Event"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventComponent;
