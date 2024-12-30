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
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { createEventSchema } from "./schemas";

const CreateEventComponent = () => {
  const { data } = useSession(); // dari next-auth
  const user = data?.user;

  const router = useRouter();
  const { mutateAsync: createEvent, isPending: isUpdating } = useCreateEvent();

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const { data: countries } = useGetCountries();

  const { data: citiesByCountry = [], isLoading: citiesLoading } = useGetCities(
    { countryId: Number(selectedCountry) }
  );

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
    <div className="w-full py-20 flex items-center justify-center">
      <div className="w-[1080px]">
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-6">
            {selectedImage && (
              <div className="w-full flex justify-center">
                <div className="relative h-[480px] w-full overflow-hidden rounded-lg">
                  <Image
                    src={selectedImage}
                    alt="thumbnail"
                    fill
                    className="object-cover duration-100 hover:scale-105"
                  />
                </div>
              </div>
            )}
            <div className="grid gap-2">
              <Label className="text-lg font-semibold">Thumbnail</Label>
              <div className="flex items-center gap-2">
                <Input
                  ref={thumbnailReff}
                  type="file"
                  accept="image/*"
                  onChange={onChangeThumbnail}
                />
                {selectedImage && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={removeThumbnail}
                    className="py-1 px-2 z-50">
                    <Trash2 />
                  </Button>
                )}
              </div>
              {!!formik.touched.thumbnnail && !!formik.errors.thumbnnail ? (
                <p className="text-xs text-red-500">
                  {formik.errors.thumbnnail}
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-lg font-semibold">
                Title
              </Label>
              <Input
                name="title"
                placeholder="Your event title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {!!formik.touched.title && !!formik.errors.title && (
                <p className="text-xs text-red-500">{formik.errors.title}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address" className="text-lg font-semibold">
                Address
              </Label>
              <textarea
                name="address"
                placeholder="Your event address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border rounded-lg p-2 w-full"
              />
              {!!formik.touched.address && !!formik.errors.address && (
                <p className="text-xs text-red-500">{formik.errors.address}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="availableSeats" className="text-lg font-semibold">
                Available Seats
              </Label>
              <Input
                type="number"
                name="availableSeats"
                placeholder="Ttoal seats of the event"
                value={formik.values.availableSeats}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {!!formik.touched.availableSeats &&
                !!formik.errors.availableSeats && (
                  <p className="text-xs text-red-500">
                    {formik.errors.availableSeats}
                  </p>
                )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price " className="text-lg font-semibold">
                Price
              </Label>
              <Input
                type="number"
                name="price"
                placeholder="Price of the ticket"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {!!formik.touched.price && !!formik.errors.price && (
                <p className="text-xs text-red-500">{formik.errors.price}</p>
              )}
            </div>
            <div className="flex gap-4 w-full">
              <div className="grid gap-2 w-full">
                <Label htmlFor="startDate" className="text-lg font-semibold">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formik.values.startDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isUpdating}
                />
                {!!formik.touched.startDate && !!formik.errors.startDate && (
                  <p className="text-xs text-red-500">
                    {formik.errors.startDate as string}
                  </p>
                )}
              </div>
              <div className="grid gap-2 w-full">
                <Label htmlFor="endDate" className="text-lg font-semibold">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formik.values.endDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isUpdating}
                />
                {!!formik.touched.endDate && !!formik.errors.endDate && (
                  <p className="text-xs text-red-500">
                    {formik.errors.endDate as string}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Country Selection */}
              <div className="grid gap-2">
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
                      {countries?.map((country) => (
                        <SelectItem key={country.id} value={String(country.id)}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* City Selection */}
              <div className="grid gap-2">
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
                      {citiesByCountry ? (
                        citiesByCountry?.map(
                          (city: { id: number; name: string }) => (
                            <SelectItem key={city.id} value={String(city.id)}>
                              {city.name}
                            </SelectItem>
                          )
                        )
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
              <Label htmlFor="categories" className="text-lg font-semibold">
                Categories
              </Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  formik.setFieldValue("categoryId", Number(value)); // Update formik state
                }}>
                <SelectTrigger className="w-full text-black">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
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
                <p className="text-xs text-red-500">
                  {formik.errors.categoryId}
                </p>
              )}
            </div>

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

            <div className="flex justify-end items-center w-full">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Loading..." : "Submit"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventComponent;
