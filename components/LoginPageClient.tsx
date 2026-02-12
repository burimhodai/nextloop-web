"use client";

import { useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPageClient() {
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");
  const registered = searchParams.get("registered");

  return (
    <AuthLayout
      title="Willkommen zurück"
      subtitle="Melden Sie sich an, um auf Ihr NextLoop-Konto zuzugreifen."
    >
      {verified && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✓ Email verified successfully! You can now login.
          </p>
        </div>
      )}

      {registered && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            ✉️ Please check your email to verify your account before logging in.
          </p>
        </div>
      )}

      <LoginForm />
    </AuthLayout>
  );
}
