export const transactionTableCols = [
  "id",
  "status",
  "event",
  "QTY",
  "total",
  "transaction date",
  "payment proof",
  "Time Left",
  "actions",
];

export const transactionStatus = [
  "UNPAID",
  "CONFIRMING",
  "DONE",
  "REJECTED",
  "EXPIRED",
  "CANCELED",
];

export const couponStatus = ["AVAILABLE", "USED", "EXPIRED"];

export const getStatusColor = (status: string) => {
  switch (status) {
    case "UNPAID":
      return "bg-red-500 text-white"; // Red for unpaid
    case "CONFIRMING":
      return "bg-amber-500 text-white"; // Yellow for confirming
    case "DONE":
      return "bg-green-500 text-white"; // Green for done
    case "REJECTED":
      return "bg-gray-500 text-white"; // Gray for rejected
    case "EXPIRED":
      return "bg-purple-500 text-white"; // Purple for expired
    case "CANCELED":
      return "bg-blue-500 text-white"; // Blue for canceled
    default:
      return "bg-gray-300 text-black"; // Default fallback
  }
};

export const getCouponStatus = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-500 text-white"; // Red for unpaid
    case "USED":
      return "bg-amber-500 text-white"; // Yellow for confirming
    case "EXPIRED":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-300 text-black"; // Default fallback
  }
};
