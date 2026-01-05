// app/auth/reset-password/[token]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Verify token on mount
  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(
        `${API_URL}/user/verify-reset-token/${token}`
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid or expired reset link");
      } else {
        setUserEmail(data.email);
      }
    } catch (err) {
      setError("Failed to verify reset link");
    } finally {
      setIsVerifying(false);
    }
  };

  const validateForm = () => {
    const errors: typeof validationErrors = {};

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${API_URL}/user/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setShowSuccess(true);
      setTimeout(() => {
        router.push("/auth/login?reset=success");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  // Verifying token
  if (isVerifying) {
    return (
      <AuthLayout title="Reset Password" subtitle="Please wait...">
        <div className="text-center py-8">
          <Loader2 className="w-12 h-12 text-[var(--muted-gold)] animate-spin mx-auto mb-4" />
          <p className="text-[var(--deep-brown)]">Verifying reset link...</p>
        </div>
      </AuthLayout>
    );
  }

  // Invalid token
  if (error && !showSuccess) {
    return (
      <AuthLayout title="Reset Password" subtitle="Unable to reset password">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[var(--charcoal)] mb-2">
            Invalid Reset Link
          </h3>
          <p className="text-[var(--deep-brown)] mb-6">{error}</p>
          <a
            href="/auth/forgot-password"
            className="inline-block px-6 py-3 bg-[var(--charcoal)] text-[var(--ivory)] rounded-lg hover:bg-[var(--muted-gold)] hover:text-[var(--charcoal)] transition-all font-medium"
          >
            Request New Reset Link
          </a>
        </div>
      </AuthLayout>
    );
  }

  // Success state
  if (showSuccess) {
    return (
      <AuthLayout title="Password Reset" subtitle="Success!">
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
            Password Reset Successfully!
          </h3>
          <p className="text-[var(--deep-brown)] mb-4">
            Your password has been updated. You can now login with your new
            password.
          </p>
          <p className="text-sm text-[var(--soft-taupe)]">
            Redirecting to login...
          </p>
        </div>
      </AuthLayout>
    );
  }

  // Reset form
  return (
    <AuthLayout
      title="Reset Password"
      subtitle={
        userEmail ? `Reset password for ${userEmail}` : "Create a new password"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="password"
          name="password"
          label="New Password"
          placeholder="Enter your new password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (validationErrors.password) {
              setValidationErrors((prev) => ({ ...prev, password: undefined }));
            }
          }}
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

        <Input
          type="password"
          name="confirmPassword"
          label="Confirm New Password"
          placeholder="Re-enter your new password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (validationErrors.confirmPassword) {
              setValidationErrors((prev) => ({
                ...prev,
                confirmPassword: undefined,
              }));
            }
          }}
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

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </AuthLayout>
  );
}
