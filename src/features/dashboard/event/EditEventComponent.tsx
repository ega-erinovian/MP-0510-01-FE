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
import useUpdateEvent, {
  UpdateEventPayload,
} from "@/hooks/api/event/useUpdateEvent";
import { formatISO } from "date-fns";
import { useFormik } from "formik";
import {
  Calendar,
  Coins,
  MapPin,
  Tag,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { editEventSchema } from "./schemas";
import Image from "next/image";
import { toast } from "react-toastify";

interface UpdateEventComponentProps {
  id: number;
}

const EditEventComponent: FC<UpdateEventComponentProps> = ({ id }) => {
  const router = useRouter();
  const { data: event, isLoading: isEventLoading } = useGetEvent(id);
  const { mutateAsync: updateEvent, isPending: isUpdating } = useUpdateEvent();
  const thumbnailRef = useRef<HTMLInputElement>(null);

  const [isFormReady, setIsFormReady] = useState(false);
  const formInitialized = useRef(false);

  // Initialize state with null/empty values
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>(
    String(event?.cityId)
  );
  const [selectedCountry, setSelectedCountry] = useState<string>(
    String(event?.city?.countryId)
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    String(event?.categoryId)
  );

  // Fetch required data
  const { data: countries = [] } = useGetCountries();
  const { data: citiesByCountry = [], isLoading: citiesLoading } = useGetCities(
    {
      countryId: parseInt(selectedCountry) || 0,
    }
  );
  const { data: categories = [] } = useGetCategories();

  // Effect to set initial select values when event data is loaded
  useEffect(() => {
    if (event?.city?.countryId) {
      setSelectedCountry(String(event.city.countryId));
    }
  }, [event?.city?.countryId]);

  useEffect(() => {
    if (event?.cityId) {
      setSelectedCity(String(event.cityId));
    }
  }, [event?.cityId]);

  useEffect(() => {
    if (event?.categoryId) {
      setSelectedCategory(String(event.categoryId));
    }
  }, [event?.categoryId]);

  const formik = useFormik({
    initialValues: {
      id,
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
    },
    validationSchema: editEventSchema,
    onSubmit: async (values) => {
      try {
        const payload: UpdateEventPayload = {
          ...values,
          startDate: formatISO(new Date(values.startDate)),
          endDate: formatISO(new Date(values.endDate)),
        };

        await updateEvent(payload);
        router.push("/dashboard/events");
        toast.success("Event Updated Successfully");
      } catch (error) {
        console.error("Update failed:", error);
        toast.error("Failed to update event");
      }
    },
  });

  // Single useEffect for initial data population
  useEffect(() => {
    if (
      event &&
      !isEventLoading &&
      !formInitialized.current &&
      citiesByCountry
    ) {
      // Ensure we have the event data
      const startDate = event.startDate
        ? new Date(event.startDate).toISOString().slice(0, 16)
        : "";
      const endDate = event.endDate
        ? new Date(event.endDate).toISOString().slice(0, 16)
        : "";

      formik.resetForm({
        values: {
          id,
          title: event.title || "",
          description: event.description || "",
          address: event.address || "",
          thumbnnail: null,
          price: event.price || 0,
          availableSeats: event.availableSeats || 0,
          startDate,
          endDate,
          categoryId: event.categoryId || 0,
          cityId: event.cityId || 0,
        },
      });

      // Set select values
      if (event.city?.countryId) {
        setSelectedCountry(String(event.city.countryId));
      }
      if (event.cityId) {
        setSelectedCity(String(event.cityId));
      }
      if (event.categoryId) {
        setSelectedCategory(String(event.categoryId));
      }

      formInitialized.current = true;
      setIsFormReady(true);
    }
  }, [event, isEventLoading, citiesByCountry]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      formik.setFieldValue("thumbnnail", files[0]);
      setSelectedImage(URL.createObjectURL(files[0]));
    }
  };

  const handleImageRemove = () => {
    formik.setFieldValue("thumbnnail", null);
    setSelectedImage("");
    if (thumbnailRef.current) {
      thumbnailRef.current.value = "";
    }
  };

  if (isEventLoading || !isFormReady) {
    return <Loading text="Loading Event Data" />;
  }

  return (
    <div className="w-full py-12 px-4 flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-[1080px] bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">Edit Event</h1>
        <form onSubmit={formik.handleSubmit} className="space-y-8">
          {/* Image Preview */}
          {(selectedImage || event?.thumbnnail) && (
            <div className="w-full">
              <div className="relative h-[480px] w-full overflow-hidden rounded-xl shadow-md">
                <Image
                  src={selectedImage || event?.thumbnnail || ""}
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
                ref={thumbnailRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-white border-purple-100 focus:border-purple-500 focus:ring-purple-200"
              />
              {selectedImage && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleImageRemove}
                  className="py-1 px-2 hover:bg-red-600 transition-colors">
                  <Trash2 />
                </Button>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-8">
            {/* Basic Information */}
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
                {formik.touched.title && formik.errors.title && (
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
                {formik.touched.address && formik.errors.address && (
                  <p className="text-sm text-red-500">
                    {formik.errors.address}
                  </p>
                )}
              </div>
            </div>

            {/* Numbers Section */}
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
                {formik.touched.availableSeats &&
                  formik.errors.availableSeats && (
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
                {formik.touched.price && formik.errors.price && (
                  <p className="text-sm text-red-500">{formik.errors.price}</p>
                )}
              </div>
            </div>

            {/* Dates Section */}
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
                  disabled={isUpdating}
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                />
                {formik.touched.startDate && formik.errors.startDate && (
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
                  disabled={isUpdating}
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                />
                {formik.touched.endDate && formik.errors.endDate && (
                  <p className="text-sm text-red-500">
                    {formik.errors.endDate as string}
                  </p>
                )}
              </div>
            </div>

            {/* Location Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="country"
                  className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                  <MapPin size={18} />
                  Country
                </Label>
                <Select
                  value={selectedCountry}
                  onValueChange={(value) => {
                    setSelectedCountry(value);
                    setSelectedCity("");
                    formik.setFieldValue("cityId", 0);
                  }}>
                  <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-200">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {countries.map((country: any) => (
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
                  <MapPin size={18} />
                  City
                </Label>
                <Select
                  value={selectedCity}
                  onValueChange={(value) => {
                    setSelectedCity(value);
                    formik.setFieldValue("cityId", Number(value));
                  }}
                  disabled={!selectedCountry || citiesLoading}>
                  <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-200">
                    <SelectValue
                      placeholder={
                        citiesLoading ? "Loading cities..." : "Select City"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {citiesLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading cities...
                        </SelectItem>
                      ) : citiesByCountry && citiesByCountry.length > 0 ? (
                        citiesByCountry.map((city: any) => (
                          <SelectItem key={city.id} value={String(city.id)}>
                            {city.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No cities available
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {formik.touched.cityId && formik.errors.cityId && (
                  <p className="text-sm text-red-500">{formik.errors.cityId}</p>
                )}
              </div>
            </div>

            {/* Category Section */}
            <div className="space-y-2">
              <Label
                htmlFor="categories"
                className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                <Tag size={18} />
                Event Category
              </Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  formik.setFieldValue("categoryId", Number(value));
                }}>
                <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-200">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories && categories.length > 0 ? (
                      categories.map((category: any) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No categories available
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formik.touched.categoryId && formik.errors.categoryId && (
                <p className="text-sm text-red-500">
                  {formik.errors.categoryId}
                </p>
              )}
            </div>

            {/* Description Section */}
            <div className="space-y-2">
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
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={isUpdating}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2.5 rounded-lg font-medium transition-colors">
              {isUpdating ? "Updating..." : "Update Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventComponent;
