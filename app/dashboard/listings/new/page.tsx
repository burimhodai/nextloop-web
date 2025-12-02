// app/dashboard/listings/new/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { ListingForm } from "@/components/listings/ListingForm";

export default function CreateListingPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();

  const handleSubmit = async (formData: any) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      // Upload images first
      const imageUrls: Array<{ url: string; type: string }> = [];

      for (let i = 0; i < formData.images.length; i++) {
        const file = formData.images[i];
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        // You'll need to implement image upload endpoint
        // For now, using placeholder
        const imageType = i === 0 ? "MAIN" : i === 1 ? "FRONT" : "DETAILS";
        imageUrls.push({
          url: URL.createObjectURL(file), // Replace with actual upload
          type: imageType,
        });
      }

      // Create listing
      const listingData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        condition: formData.condition,
        type: formData.type,
        category: formData.category,
        images: imageUrls,
        seller: user?._id,
        status: "ACTIVE",
      };

      const response = await fetch(`${API_URL}/listing/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(listingData),
      });

      if (!response.ok) {
        throw new Error("Failed to create listing");
      }

      const listing = await response.json();

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating listing:", error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Back to Dashboard
          </button>
        </div>

        <ListingForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
}
