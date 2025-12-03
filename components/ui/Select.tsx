// components/ui/Select.tsx
"use client";

import React from "react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
  disabled = false,
  error,
  helperText,
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-[var(--deep-brown)] mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`
            w-full px-4 py-3 
            bg-[var(--ivory)] 
            border-2 
            ${error ? "border-red-500" : "border-[var(--warm-gray)]"}
            text-[var(--charcoal)]
            font-sans
            appearance-none
            cursor-pointer
            transition-all duration-300
            hover:border-[var(--muted-gold)]
            focus:outline-none 
            focus:ring-2 
            focus:ring-[var(--muted-gold)] 
            focus:ring-opacity-50
            focus:border-[var(--muted-gold)]
            disabled:opacity-50 
            disabled:cursor-not-allowed
            disabled:bg-[var(--beige)]
          `}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className={`w-5 h-5 ${
              error ? "text-red-500" : "text-[var(--soft-taupe)]"
            } transition-colors`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-2 text-sm text-[var(--soft-taupe)]">{helperText}</p>
      )}
    </div>
  );
};
