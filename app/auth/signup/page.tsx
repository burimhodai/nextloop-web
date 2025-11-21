// app/auth/signup/page.tsx
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Join NextLoop"
      subtitle="Create your account and discover luxury goods"
    >
      <SignupForm />
    </AuthLayout>
  );
}
