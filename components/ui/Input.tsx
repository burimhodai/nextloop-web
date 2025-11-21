// components/ui/Input.tsx
import React, { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--deep-brown)] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--soft-taupe)]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 
              ${icon ? "pl-10" : ""}
              bg-[var(--ivory)] 
              border border-[var(--warm-gray)]
              text-[var(--charcoal)]
              placeholder:text-[var(--soft-taupe)]
              rounded-lg
              transition-all duration-300
              focus:outline-none 
              focus:border-[var(--muted-gold)]
              focus:ring-2 
              focus:ring-[var(--muted-gold)]/20
              hover:border-[var(--soft-taupe)]
              disabled:opacity-50 
              disabled:cursor-not-allowed
              ${
                error
                  ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                  : ""
              }
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
