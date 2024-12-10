// components/ui/loader.tsx
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const Loader = ({ className }: { className?: string }) => {
  return <Loader2 className={cn("h-8 w-8 animate-spin", className)} />;
};
