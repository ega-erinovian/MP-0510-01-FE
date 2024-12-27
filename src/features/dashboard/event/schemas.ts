import * as Yup from "yup";
import YupPassword from "yup-password";

YupPassword(Yup);

export const editEventSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters long"),
  availableSeats: Yup.number()
    .required("Available seats are required")
    .positive("Available seats must be a positive number")
    .integer("Available seats must be a whole number"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number"),
  startDate: Yup.date()
    .required("Start date is required")
    .min(new Date(), "Start date cannot be in the past"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after the start date"),
  country: Yup.string().required("Country is required"),
  cityId: Yup.number()
    .required("City is required")
    .positive("Invalid city selection"),
  category: Yup.string().required("Category is required"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters long"),
});
