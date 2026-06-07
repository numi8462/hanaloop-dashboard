import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-[#a8c3de] bg-white px-3 py-1 text-sm text-[#0d253d] transition-colors outline-none",
        "placeholder:text-[#94a3b8]",
        "focus-visible:border-[#533afd] focus-visible:ring-2 focus-visible:ring-[#533afd]/15",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[#f6f9fc] disabled:text-[#94a3b8]",
        "aria-invalid:border-red-300 aria-invalid:ring-2 aria-invalid:ring-red-100",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
