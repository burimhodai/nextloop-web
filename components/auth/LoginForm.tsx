// components/auth/LoginForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/authStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = () => {
    const errors: typeof validationErrors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(formData);
      // Success! Redirect to dashboard
      router.push("/profile");
    } catch (err) {
      // Error is already handled by the store
      console.error("Login error:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Clear global error when user starts typing
    if (error) {
      clearError();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
              <h4 className="text-sm font-medium text-red-800">Login Failed</h4>
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
        value={formData.email}
        onChange={handleChange}
        error={validationErrors.email}
        disabled={isLoading}
        autoComplete="email"
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

      {/* Password Input */}
      <Input
        type="password"
        name="password"
        label="Password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        error={validationErrors.password}
        disabled={isLoading}
        autoComplete="current-password"
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        }
      />

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-[var(--warm-gray)] text-[var(--charcoal)] focus:ring-[var(--muted-gold)] transition-all"
          />
          <span className="ml-2 text-[var(--deep-brown)] group-hover:text-[var(--charcoal)] transition-colors">
            Remember me
          </span>
        </label>

        <Link
          href="/auth/forgot-password"
          className="text-[var(--charcoal)] hover:text-[var(--muted-gold)] font-medium transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={isLoading}
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--warm-gray)]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[var(--sand)] text-[var(--deep-brown)]">
            New to NextLoop?
          </span>
        </div>
      </div>

      {/* Signup Link */}
      <div className="text-center">
        <Link
          href="/auth/signup"
          className="inline-flex items-center text-sm font-medium text-[var(--charcoal)] hover:text-[var(--muted-gold)] transition-colors group"
        >
          Create your account
          <svg
            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </form>
  );
};
