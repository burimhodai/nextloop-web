// app/create-listing/page.tsx
"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import {
  ListingForm,
  ListingFormData,
} from "@/components/listings/ListingForm";

export default function CreateListingPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();

  const isIdVerified = user?.idVerification?.success || false;

  const handleSubmit = async (data: ListingFormData) => {
    try {
      const formData = new FormData();

      // Add all the form fields
      formData.append("name", data.title);
      formData.append("description", data.description);
      formData.append("condition", data.condition);
      formData.append("type", data.type);
      formData.append("category", data.category);
      formData.append("seller", user?._id || "");

      // Add pricing based on listing type
      if (data.type === "AUCTION") {
        formData.append("startingPrice", data.price.toString());
      } else {
        formData.append("buyNowPrice", data.price.toString());
      }

      // Add images
      Object.entries(data.images).forEach(([type, file]) => {
        if (file) {
          formData.append("images", file);
          formData.append("imageTypes", type);
        }
      });

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/listing/create`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create listing");
      }

      const result = await response.json();

      // Redirect to the new listing
      router.push(`/listing/${result._id}`);
    } catch (error) {
      console.error("Error creating listing:", error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/listings");
  };

  // If not verified, show verification required page
  if (!isIdVerified) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white border border-[#d4cec4] rounded-lg p-12 text-center shadow-lg">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert
                className="w-10 h-10 text-amber-600"
                strokeWidth={1.5}
              />
            </div>

            <h1
              className="text-3xl font-bold text-[#3a3735] mb-4"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              ID Verification Required
            </h1>

            <p className="text-[#5a524b] mb-8 leading-relaxed max-w-lg mx-auto">
              To maintain the quality and authenticity of our marketplace, all
              sellers must complete ID verification before creating listings.
              This helps protect both buyers and sellers.
            </p>

            <div className="bg-[#f5f1ea] border border-[#d4cec4] rounded-lg p-6 mb-8 text-left">
              <h3 className="text-sm font-semibold text-[#3a3735] mb-3 uppercase tracking-wider">
                Why We Verify
              </h3>
              <ul className="space-y-2 text-sm text-[#5a524b]">
                <li className="flex items-start gap-2">
                  <span className="text-[#c8a882] mt-0.5">•</span>
                  <span>Prevents fraud and ensures marketplace safety</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c8a882] mt-0.5">•</span>
                  <span>Builds trust between buyers and sellers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c8a882] mt-0.5">•</span>
                  <span>Complies with legal requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c8a882] mt-0.5">•</span>
                  <span>Quick and secure process (takes 2-3 minutes)</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 bg-[#f5f1ea] text-[#3a3735] rounded-lg hover:bg-[#e8dfd0] transition-colors font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                Back to Dashboard
              </button>
              <a
                href="/profile/verify"
                className="px-8 py-3 bg-[#3a3735] text-[#c8a882] rounded-lg hover:bg-[#c8a882] hover:text-[#3a3735] transition-all font-medium"
              >
                Verify ID Now
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f4] py-12 px-4">
      <ListingForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEdit={false}
      />
    </div>
  );
}
