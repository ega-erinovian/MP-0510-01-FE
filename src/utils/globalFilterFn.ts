import { Row } from "@tanstack/react-table";

const flattenObject = (
  obj: Record<string, any>,
  prefix = ""
): Record<string, any> => {
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(acc, flattenObject(obj[key], newKey));
    } else {
      acc[newKey] = obj[key];
    }
    return acc;
  }, {} as Record<string, any>);
};

const globalFilterFn = <TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: string
): boolean => {
  const flattenedRow = flattenObject(row.original as Record<string, any>);
  return Object.values(flattenedRow).some((value) =>
    String(value).toLowerCase().includes(filterValue.toLowerCase())
  );
};

export default globalFilterFn;
