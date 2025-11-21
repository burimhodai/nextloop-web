// components/auth/SignupForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/authStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const SignupForm: React.FC = () => {
  const router = useRouter();
  const { signup, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    phone?: string;
  }>({});

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const errors: typeof validationErrors = {};

    if (!formData.fullName || formData.fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      errors.phone = "Invalid phone format";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted");

    if (!agreedToTerms) {
      setValidationErrors({
        fullName: "Please agree to the Terms and Conditions",
      });
      return;
    }

    if (!validateForm()) {
      console.log("Validation failed:", validationErrors);
      return;
    }

    try {
      console.log("Calling signup...");
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
      });

      console.log("Signup successful!");
      // Show success message
      setShowSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/login?registered=true");
      }, 2000);
    } catch (err) {
      console.error("Signup error in component:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (error) {
      clearError();
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[var(--charcoal)] mb-2">
          Account Created Successfully!
        </h3>
        <p className="text-[var(--deep-brown)] mb-4">
          Please check your email to verify your account.
        </p>
        <p className="text-sm text-[var(--soft-taupe)]">
          Redirecting you to login...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
              <h4 className="text-sm font-medium text-red-800">
                Registration Failed
              </h4>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Full Name */}
      <Input
        type="text"
        name="fullName"
        label="Full Name"
        placeholder="John Doe"
        value={formData.fullName}
        onChange={handleChange}
        error={validationErrors.fullName}
        disabled={isLoading}
        autoComplete="name"
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        }
      />

      {/* Email */}
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

      {/* Phone (Optional) */}
      <Input
        type="tel"
        name="phone"
        label="Phone Number (Optional)"
        placeholder="+41 79 123 45 67"
        value={formData.phone}
        onChange={handleChange}
        error={validationErrors.phone}
        disabled={isLoading}
        autoComplete="tel"
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
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        }
      />

      {/* Password */}
      <Input
        type="password"
        name="password"
        label="Password"
        placeholder="Create a strong password"
        value={formData.password}
        onChange={handleChange}
        error={validationErrors.password}
        disabled={isLoading}
        autoComplete="new-password"
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

      {/* Confirm Password */}
      <Input
        type="password"
        name="confirmPassword"
        label="Confirm Password"
        placeholder="Re-enter your password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={validationErrors.confirmPassword}
        disabled={isLoading}
        autoComplete="new-password"
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />

      {/* Terms Checkbox */}
      <label className="flex items-start cursor-pointer group">
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="w-4 h-4 mt-0.5 rounded border-[var(--warm-gray)] text-[var(--charcoal)] focus:ring-[var(--muted-gold)] transition-all"
        />
        <span className="ml-2 text-sm text-[var(--deep-brown)]">
          I agree to the{" "}
          <Link
            href="/terms"
            className="text-[var(--charcoal)] hover:text-[var(--muted-gold)] font-medium transition-colors"
          >
            Terms and Conditions
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-[var(--charcoal)] hover:text-[var(--muted-gold)] font-medium transition-colors"
          >
            Privacy Policy
          </Link>
        </span>
      </label>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--warm-gray)]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[var(--sand)] text-[var(--deep-brown)]">
            Already have an account?
          </span>
        </div>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center text-sm font-medium text-[var(--charcoal)] hover:text-[var(--muted-gold)] transition-colors group"
        >
          Sign in instead
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
