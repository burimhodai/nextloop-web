"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/verify/${params.token}`
        );
        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage(data.message);
          setTimeout(() => router.push("/auth/login?verified=true"), 3000);
        } else {
          setStatus("error");
          setMessage(data.message);
        }
      } catch (error) {
        setStatus("error");
        setMessage("Failed to verify email");
      }
    };

    verifyEmail();
  }, [params.token, router]);

  return (
    <AuthLayout title="Email Verification">
      <div className="text-center py-8">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--charcoal)] mx-auto mb-4" />
            <p>Verifying your email...</p>
          </>
        )}

        {status === "success" && (
          <>
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
            <h3 className="text-xl font-semibold mb-2">Email Verified!</h3>
            <p className="text-[var(--deep-brown)] mb-4">{message}</p>
            <p className="text-sm text-[var(--soft-taupe)]">
              Redirecting to login...
            </p>
          </>
        )}

        {status === "error" && (
          <>
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
            <h3 className="text-xl font-semibold mb-2">Verification Failed</h3>
            <p className="text-[var(--deep-brown)] mb-4">{message}</p>
            <Button onClick={() => router.push("/auth/login")}>
              Back to Login
            </Button>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
