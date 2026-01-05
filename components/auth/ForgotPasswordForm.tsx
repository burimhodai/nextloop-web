// components/auth/ForgotPasswordForm.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    if (!email) {
      return "Email is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Invalid email format";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setValidationError(emailError);
      return;
    }

    setIsLoading(true);
    setError(null);
    setValidationError(null);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${API_URL}/user/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      // Show success message
      setShowSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset email"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (validationError) {
      setValidationError(null);
    }
    if (error) {
      setError(null);
    }
  };

  // Success State
  if (showSuccess) {
    return (
      <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[var(--charcoal)] mb-2">
          Check Your Email
        </h3>
        <p className="text-[var(--deep-brown)] mb-4">
          We've sent password reset instructions to <strong>{email}</strong>
        </p>
        <p className="text-sm text-[var(--soft-taupe)] mb-6">
          Please check your inbox and follow the link to reset your password.
          The link will expire in 1 hour.
        </p>
        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="inline-flex items-center text-sm font-medium text-[var(--charcoal)] hover:text-[var(--muted-gold)] transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Login
          </Link>
          <div className="text-sm text-[var(--soft-taupe)]">
            Didn't receive the email?{" "}
            <button
              onClick={() => setShowSuccess(false)}
              className="text-[var(--charcoal)] hover:text-[var(--muted-gold)] font-medium transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Info Banner */}
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-600 mr-3 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Password Reset Instructions</p>
            <p>
              Enter your email address and we'll send you instructions to reset
              your password.
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-600 mr-3 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-red-800">Error</h4>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Email Input */}
      <Input
        type="email"
        name="email"
        label="Email Address"
        placeholder="you@example.com"
        value={email}
        onChange={handleChange}
        error={validationError || undefined}
        disabled={isLoading}
        autoComplete="email"
        autoFocus
        icon={
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        }
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send Reset Instructions"}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--warm-gray)]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[var(--sand)] text-[var(--deep-brown)]">
            Remember your password?
          </span>
        </div>
      </div>

      {/* Back to Login Link */}
      <div className="text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center text-sm font-medium text-[var(--charcoal)] hover:text-[var(--muted-gold)] transition-colors group"
        >
          <svg
            className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Login
        </Link>
      </div>

      {/* Need Help */}
      <div className="mt-6 pt-6 border-t border-[var(--warm-gray)]">
        <p className="text-center text-sm text-[var(--soft-taupe)]">
          Need help?{" "}
          <Link
            href="/support"
            className="text-[var(--charcoal)] hover:text-[var(--muted-gold)] font-medium transition-colors"
          >
            Contact Support
          </Link>
        </p>
      </div>
    </form>
  );
};
