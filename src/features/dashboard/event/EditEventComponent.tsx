"use client";

import Loading from "@/components/dashboard/Loading";
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
import useGetEvent from "@/hooks/api/event/useGetEvent";
import useUpdateEvent from "@/hooks/api/event/useUpdateEvent";
import { formatISO } from "date-fns";
import { useFormik } from "formik";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { editEventSchema } from "./schemas";

interface UpdateEventComponentProps {
  id: number;
}

const EditEventComponent: FC<UpdateEventComponentProps> = ({ id }) => {
  const router = useRouter();
  const { data: event, isLoading: isEventLoading } = useGetEvent(id);
  const { mutateAsync: updateEvent, isPending: isUpdating } = useUpdateEvent();

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>(
    String(event?.cityId)
  );

  const { data: countries } = useGetCountries();
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const { data: citiesByCountry, isLoading: citiesLoading } = useGetCities({
    countryId: parseInt(selectedCountry),
  });

  const { data: categories = [] } = useGetCategories();

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const thumbnailReff = useRef<HTMLInputElement>(null);
  const [isFormReady, setIsFormReady] = useState(false);
  const formInitialized = useRef(false);

  const formik = useFormik({
    initialValues: {
      id,
      title: "",
      description: "",
      price: 0,
      availableSeats: 0,
      thumbnnail: null,
      startDate: "",
      endDate: "",
      categoryId: 0,
      cityId: 0,
    },
    validationSchema: editEventSchema,
    onSubmit: async (values) => {
      try {
        await updateEvent({
          ...values,
          startDate: formatISO(new Date(values.startDate)),
          endDate: formatISO(new Date(values.endDate)),
        });

        router.push("/dashboard/events");
      } catch (error) {
        console.log(error);
      }
    },
  });

  const onChangeThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      formik.setFieldValue("profilePicture", files[0]);
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

  useEffect(() => {
    if (
      event &&
      !isEventLoading &&
      !formInitialized.current &&
      citiesByCountry
    ) {
      // Initialize form with data
      formik.resetForm({
        values: {
          id,
          title: event.title,
          description: event.description,
          thumbnnail: null,
          price: event.price,
          availableSeats: event.availableSeats,
          startDate: new Date(event.startDate).toISOString().slice(0, 16),
          endDate: new Date(event.endDate).toISOString().slice(0, 16),
          categoryId: event.categoryId,
          cityId: event.cityId,
        },
      });

      setSelectedCountry(String(citiesByCountry[0].countryId));

      setSelectedCity(String(event.cityId));

      setSelectedCategory(String(event.categoryId));

      formInitialized.current = true;
      setIsFormReady(true);
    }
  }, [event, isEventLoading]);

  if (isEventLoading || !isFormReady) {
    return <Loading text="Event Data" />;
  }

  return (
    <div className="w-full py-20 flex items-center justify-center">
      <div className="w-[720px]">
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-6">
            {(selectedImage || event?.thumbnnail) && (
              <div className="w-full flex justify-center">
                <div className="relative h-[300px] w-full">
                  <img
                    src={
                      selectedImage === ""
                        ? event?.thumbnnail || ""
                        : selectedImage
                    }
                    alt="thumbnail-preview"
                    className="object-cover w-full h-full"
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
                onValueChange={(value) => setSelectedCategory(value)}>
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

export default EditEventComponent;
