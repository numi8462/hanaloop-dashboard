import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-slate-600 bg-[#2f323a] px-2.5 py-1 text-sm text-slate-200 transition-colors outline-none",
        "placeholder:text-slate-500",
        "focus-visible:border-[#0b3d91] focus-visible:ring-2 focus-visible:ring-[#0b3d91]/30",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[#2a2e36] disabled:text-slate-500",
        "aria-invalid:border-red-500/50 aria-invalid:ring-2 aria-invalid:ring-red-500/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
