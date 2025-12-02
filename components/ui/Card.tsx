// components/ui/Card.tsx
"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "bordered" | "elevated" | "ghost";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  padding = "md",
  hover = false,
  onClick,
}) => {
  const variantClasses = {
    default: "bg-[var(--sand)] border border-[var(--warm-gray)]",
    bordered: "bg-[var(--ivory)] border-2 border-[var(--warm-gray)]",
    elevated: "bg-[var(--sand)] shadow-lg border border-[var(--warm-gray)]",
    ghost: "bg-transparent border border-transparent",
  };

  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const hoverClasses = hover
    ? "transition-all duration-300 hover:shadow-md hover:border-[var(--muted-gold)] hover:-translate-y-0.5"
    : "";

  const clickableClasses = onClick ? "cursor-pointer" : "";

  return (
    <div
      className={`
        rounded-xl 
        ${variantClasses[variant]} 
        ${paddingClasses[padding]} 
        ${hoverClasses} 
        ${clickableClasses}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = "",
}) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = "",
  as: Component = "h3",
}) => {
  return (
    <Component className={`text-[var(--charcoal)] font-medium ${className}`}>
      {children}
    </Component>
  );
};

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className = "",
}) => {
  return (
    <p className={`text-[var(--deep-brown)] text-sm mt-1 ${className}`}>
      {children}
    </p>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = "",
}) => {
  return <div className={className}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`mt-6 pt-4 border-t border-[var(--warm-gray)] ${className}`}
    >
      {children}
    </div>
  );
};
