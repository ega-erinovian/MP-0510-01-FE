"use client";

import { FC, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Eye, EyeOff, X } from "lucide-react";
import { cn } from "@/lib/utils";

const PasswordInput: FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  showPasswordStrength?: boolean;
}> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  showPasswordStrength,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };

  const strength = getPasswordStrength(value);

  return (
    <div className="flex flex-col space-y-1.5 relative group">
      <Label
        htmlFor={name}
        className="text-sm font-medium transition-colors group-focus-within:text-primary">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder="Min 8 - 12 Characters"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={cn(
            "pr-10 transition-all duration-200",
            "border-muted-foreground/20",
            "focus:border-primary focus:ring-primary",
            error && touched ? "border-red-500" : ""
          )}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-primary transition-colors">
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {showPasswordStrength && value && (
        <div className="space-y-1">
          <div className="flex gap-1 h-1">
            {[1, 2, 3, 4].map((segment) => (
              <div
                key={segment}
                className={cn(
                  "h-full flex-1 rounded-full transition-all duration-500",
                  strength >= segment * 25
                    ? strength <= 50
                      ? "bg-red-500"
                      : strength <= 75
                      ? "bg-yellow-500"
                      : "bg-green-500"
                    : "bg-muted"
                )}
              />
            ))}
          </div>
          <p
            className={cn(
              "text-xs",
              strength <= 50
                ? "text-red-500"
                : strength <= 75
                ? "text-yellow-500"
                : "text-green-500"
            )}>
            {strength <= 50 ? "Weak" : strength <= 75 ? "Medium" : "Strong"}{" "}
            password
          </p>
        </div>
      )}
      {error && touched && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <X size={12} />
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
