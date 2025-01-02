import { cn } from "@/lib/utils";
import { FC } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { XCircle } from "lucide-react";

const FormField: FC<{
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  icon?: React.ReactNode;
  className?: string;
}> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  icon,
  className,
}) => (
  <div className={cn("grid gap-2", className)}>
    <Label
      htmlFor={name}
      className="text-sm font-semibold flex items-center gap-2">
      {icon}
      {label}
    </Label>
    <div className="relative">
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={cn(
          "transition-all duration-200",
          "border-muted-foreground/20",
          "focus:border-primary focus:ring-primary",
          error && touched ? "border-red-500" : ""
        )}
      />
    </div>
    {touched && error && (
      <p className="text-xs text-red-500 flex items-center gap-1">
        <XCircle size={12} />
        {error}
      </p>
    )}
  </div>
);

export default FormField;
