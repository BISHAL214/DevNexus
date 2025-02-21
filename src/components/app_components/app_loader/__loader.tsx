import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface LoaderProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  showProgress?: boolean;
  text?: string;
}

export function Loader({
  size = "default",
  className,
}: LoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: "w-24 p-2 gap-2",
    default: "w-36 p-4 gap-3",
    lg: "w-48 p-6 gap-4",
  };

  const spinnerSizes = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const textSizes = {
    sm: "text-xs",
    default: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="relative">
      <Loader2
        className={cn("animate-spin text-primary", className, spinnerSizes[size])}
      />
    </div>
  );
}
