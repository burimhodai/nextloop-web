// components/ui/Button.tsx
import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-[var(--charcoal)] 
      text-[var(--ivory)]
      hover:bg-[var(--deep-brown)]
      focus:ring-[var(--charcoal)]
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-[var(--muted-gold)]
      text-[var(--charcoal)]
      hover:bg-[#b89770]
      focus:ring-[var(--muted-gold)]
      shadow-sm hover:shadow-md
    `,
    outline: `
      bg-transparent
      border-2 border-[var(--charcoal)]
      text-[var(--charcoal)]
      hover:bg-[var(--charcoal)]
      hover:text-[var(--ivory)]
      focus:ring-[var(--charcoal)]
    `,
    ghost: `
      bg-transparent
      text-[var(--charcoal)]
      hover:bg-[var(--beige)]
      focus:ring-[var(--muted-gold)]
    `,
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};
