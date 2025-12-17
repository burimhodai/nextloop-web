// app/(dashboard)/profile/verify/page.tsx
"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { useRouter } from "next/navigation";
import { IDVerification } from "@/components/verification/IDVerification";
import { useState } from "react";
import {
  ShieldCheck,
  AlertCircle,
  Clock,
  XCircle,
  CheckCircle,
} from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verificationState = user?.idVerification?.state || "NOT_SUBMITTED";

  const handleSubmit = async (data: {
    documentImages: string[]; // base64 strings
  }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(
        `${API_URL}/id-verification/submit/${user?._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Verification submission failed");
      }

      // Update local user state to IN_REVIEW
      useAuthStore.setState({
        user: {
          ...user!,
          idVerification: {
            ...user!.idVerification,
            state: "IN_REVIEW",
          },
        },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit verification"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // State: APPROVED - Already verified, redirect to profile
  if (verificationState === "APPROVED") {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-8 text-center shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle
                className="w-8 h-8 text-green-600"
                strokeWidth={1.5}
              />
            </div>
            <h2
              className="text-2xl font-semibold text-[#3a3735] mb-2"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Already Verified!
            </h2>
            <p className="text-[#5a524b] mb-6">
              Your ID has been successfully verified. You have full access to
              all marketplace features.
            </p>
            <button
              onClick={() => router.push("/profile")}
              className="px-6 py-3 bg-[#3a3735] text-[#c8a882] rounded-lg hover:bg-[#c8a882] hover:text-[#3a3735] transition-all font-medium"
            >
              Go to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State: IN_REVIEW - Verification submitted, waiting for review
  if (verificationState === "IN_REVIEW") {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-[#3a3735] mb-2"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            ID Verification
          </h1>
          <p className="text-[#5a524b]">Your verification is being reviewed</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-8 text-center shadow-lg">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <Clock className="w-10 h-10 text-amber-600" strokeWidth={1.5} />
              <div className="absolute inset-0 border-4 border-amber-400 rounded-full animate-ping opacity-20"></div>
            </div>

            <h2
              className="text-2xl font-semibold text-[#3a3735] mb-3"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Verification In Review
            </h2>

            <p className="text-[#5a524b] mb-6 leading-relaxed">
              Thank you for submitting your ID verification! Our admin team is
              currently reviewing your documents. This process typically takes{" "}
              <strong>24-48 hours</strong>.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left mb-6">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">
                What happens next?
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">1.</span>
                  <span>
                    Our admin team will carefully review your submitted
                    documents
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">2.</span>
                  <span>
                    You'll receive an email notification once the review is
                    complete
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">3.</span>
                  <span>
                    If approved, you'll have immediate access to all marketplace
                    features
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">4.</span>
                  <span>
                    Your ID images will be automatically deleted after the
                    review
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 bg-[#3a3735] text-[#c8a882] rounded-lg hover:bg-[#c8a882] hover:text-[#3a3735] transition-all font-medium"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State: REJECTED - Show rejection message and allow resubmission
  if (verificationState === "REJECTED") {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-[#3a3735] mb-2"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            ID Verification
          </h1>
          <p className="text-[#5a524b]">
            Your previous verification was not successful
          </p>
        </div>

        {/* Rejection Notice */}
        <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <XCircle className="w-8 h-8 text-red-600" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Verification Not Approved
              </h3>
              <p className="text-sm text-red-800 mb-3">
                Unfortunately, we were unable to verify your ID. Please review
                the reason below and submit again with corrected information.
              </p>
              {user?.idVerification?.rejection_reason && (
                <div className="bg-red-100 border border-red-300 rounded p-3">
                  <p className="text-sm font-medium text-red-900">
                    <strong>Reason:</strong>{" "}
                    {user.idVerification.rejection_reason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
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
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Common Reasons for Rejection
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Image quality too low or text not readable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Glare or reflections obscuring information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>ID card edges not fully visible in photo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Document appears to be expired or invalid</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  Submission Failed
                </h4>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Allow resubmission */}
        <IDVerification onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    );
  }

  // State: NOT_SUBMITTED - Show verification form
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-[#3a3735] mb-2"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          ID Verification
        </h1>
        <p className="text-[#5a524b]">
          Verify your Swiss ID to unlock full marketplace access
        </p>
      </div>

      {/* Info Banner */}
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
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
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Why ID Verification?
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              To ensure the safety and security of all NextLoop users, we
              require Swiss ID verification for:
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Creating and managing listings on the marketplace</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Participating in auctions and placing bids</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Making purchases and ensuring secure transactions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>
                  Preventing fraud and maintaining marketplace integrity
                </span>
              </li>
            </ul>
            <p className="text-xs text-blue-700 mt-4 flex items-center gap-2">
              <svg
                className="w-4 h-4"
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
              Your ID images will be securely stored until reviewed by our admin
              team, then automatically deleted.
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
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
      <IDVerification onSubmit={handleSubmit} isSubmitting={isSubmitting} />

      {/* Security Notice */}
      <div className="mt-8 p-6 bg-[#f5f1ea] border border-[#d4cec4] rounded-lg">
        <div className="flex items-start gap-4">
          <svg
            className="w-6 h-6 text-[#c8a882] flex-shrink-0 mt-0.5"
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
          <div className="text-sm text-[#5a524b]">
            <p className="font-semibold mb-2 text-[#3a3735]">
              Your Data is Protected
            </p>
            <p className="leading-relaxed">
              We use bank-level encryption to protect your personal information.
              Your ID images are securely stored and will be reviewed by our
              trained verification team within 24-48 hours. Once the
              verification is complete (approved or rejected), all images are
              automatically deleted from our servers in compliance with data
              protection regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
