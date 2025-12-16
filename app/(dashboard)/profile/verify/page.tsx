// app/profile/verify/page.tsx
"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { IDVerification } from "@/components/verification/IDVerification";
import { useEffect, useState } from "react";
import type { VerificationSubmission } from "@/lib/types/verification.types";

export default function VerifyPage() {
  const router = useRouter();
  const { user, isAuthenticated, token, logout } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }

    // If already verified, redirect to profile
    if (user?.idVerification.success) {
      router.push("/profile");
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (data: VerificationSubmission) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      console.log("Submitting to backend:", data);

      const response = await fetch(`${API_URL}/user/verify-id/${user?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log({ result });
      if (!response.ok) {
        throw new Error(result.message || "Verification submission failed");
      }

      // Update local user state if verification was successful
      if (result.data) {
        useAuthStore.setState({ user: result.data });
      }

      setSuccess(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/profile");
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit verification"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  if (!user || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--ivory)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--charcoal)] mx-auto mb-4"></div>
          <p className="text-[var(--deep-brown)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--ivory)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[var(--sand)] rounded-2xl shadow-xl p-8 border border-[var(--warm-gray)] text-center">
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
          <h2 className="text-2xl font-semibold text-[var(--charcoal)] mb-2">
            Verification Submitted!
          </h2>
          <p className="text-[var(--deep-brown)] mb-4">
            Your identity has been verified successfully!
          </p>
          <p className="text-sm text-[var(--soft-taupe)] mb-6">
            Redirecting you back to your profile...
          </p>
          <Button onClick={() => router.push("/profile")} variant="primary">
            Return to Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--ivory)]">
      {/* Header */}
      <header className="bg-[var(--sand)] border-b border-[var(--warm-gray)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/profile")}
                className="text-[var(--deep-brown)] hover:text-[var(--charcoal)] transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-[var(--charcoal)]">
                ID Verification
              </h1>
            </div>
            <Button variant="outline" onClick={handleLogout} size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Info Banner */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-blue-600"
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
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Why ID Verification?
              </h3>
              <p className="text-sm text-blue-800 mb-3">
                To ensure the safety and security of all NextLoop users, we
                require Swiss ID verification for:
              </p>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Making purchases or bids over CHF 1,000</li>
                <li>Becoming a verified seller</li>
                <li>Accessing premium marketplace features</li>
                <li>Ensuring secure transactions and preventing fraud</li>
              </ul>
              <p className="text-xs text-blue-700 mt-3">
                🔒 Your ID image is NOT stored. We only use AI to extract and
                verify text information.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
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
                  Submission Failed
                </h4>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* ID Verification Component */}
        <IDVerification onSubmit={handleSubmit} />

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-[var(--sand)] border border-[var(--warm-gray)] rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-[var(--muted-gold)] mr-3 mt-0.5"
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
            <div className="text-sm text-[var(--deep-brown)]">
              <p className="font-semibold mb-1">Your data is protected</p>
              <p>
                We use bank-level encryption to protect your personal
                information. Your documents are reviewed by our trained
                verification team and deleted after verification is complete, in
                compliance with data protection regulations.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
