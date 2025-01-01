export const transactionTableCols = [
  "id",
  "status",
  "customer",
  "event",
  "QTY",
  "total",
  "transaction date",
  "payment proof",
  "actions",
];

export const transactionStatus = ["DONE", "REJECTED"];

export const getStatusColor = (status: string) => {
  switch (status) {
    case "UNPAID":
      return "bg-red-500 text-white";
    case "CONFIRMING":
      return "bg-amber-500 text-white";
    case "DONE":
      return "bg-green-500 text-white";
    case "REJECTED":
      return "bg-gray-500 text-white";
    case "EXPIRED":
      return "bg-purple-500 text-white";
    case "CANCELED":
      return "bg-blue-500 text-white";
    default:
      return "bg-gray-300 text-black";
  }
};
