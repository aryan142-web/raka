import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white text-black shadow-sm p-4",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div className={cn("mb-2 font-semibold text-lg", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3 className={cn("text-xl font-bold leading-none", className)} {...props} />
  );
}

export function CardContent({ className, ...props }) {
  return (
    <div className={cn("text-sm text-gray-700", className)} {...props} />
  );
}
