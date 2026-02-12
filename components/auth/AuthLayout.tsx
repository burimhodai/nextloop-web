// components/auth/AuthLayout.tsx
"use client";

import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen bg-[var(--ivory)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--charcoal)] mb-2">
            NextLoop
          </h1>
          <div className="w-16 h-0.5 bg-[var(--muted-gold)] mx-auto" />
        </div>

        {/* Auth Card */}
        <div className="bg-[var(--sand)] shadow-xl p-8 border border-[var(--warm-gray)]">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--charcoal)] mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-[var(--deep-brown)]">{subtitle}</p>
            )}
          </div>

          {/* Content */}
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-[var(--deep-brown)] mt-6">
          © 2026 NextLoop. Luxus neu definiert.
        </p>
      </div>
    </div>
  );
};
