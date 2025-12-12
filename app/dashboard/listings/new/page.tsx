"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { ListingForm } from "@/components/listings/ListingForm";
import { ListingTypes, ImageTypes } from "@/lib/types/listing.types";
import { ArrowLeft } from "lucide-react";

export default function CreateListingPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();

  const handleSubmit = async (formData: any) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const payload = new FormData();
      const imageKeys = Object.values(ImageTypes);

      // Add images
      for (const type of imageKeys) {
        // @ts-ignore
        const file = formData.images[type];
        if (file) payload.append(type, file);
      }

      // Add basic fields
      payload.append("userId", user?._id || "");
      payload.append("name", formData.title);
      payload.append("description", formData.description);

      // FIX: Ensure category is always a string ID
      const categoryId =
        typeof formData.category === "object"
          ? formData.category._id ||
            formData.category.id ||
            String(formData.category)
          : String(formData.category);

      payload.append("category", categoryId);

      if (user?._id) payload.append("seller", user._id);
      payload.append("condition", formData.condition);
      payload.append("type", formData.type);
      payload.append("status", "ACTIVE");

      // Add pricing based on listing type
      if (formData.type === ListingTypes.DIRECT_BUY) {
        payload.append("buyNowPrice", formData.price.toString());
        payload.append("startingPrice", "0");
      } else if (formData.type === ListingTypes.AUCTION) {
        payload.append("startingPrice", formData.price.toString());
        payload.append("currentPrice", formData.price.toString());
        payload.append("bidIncrement", "10");

        // Create end time 7 days from now in Swiss timezone
        const endTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        payload.append("endTime", endTime.toISOString());
      }

      // FIXED: Correct API endpoint with /api prefix
      const response = await fetch(`${API_URL}/listing/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create listing");
      }

      const result = await response.json();
      console.log("Listing created successfully:", result);

      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating listing:", error);
      throw error;
    }
  };

  const handleCancel = () => router.push("/dashboard");

  return (
    <div className="min-h-screen bg-[#faf8f4] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="group flex items-center text-[#5a524b] hover:text-[#c8a882] transition-colors text-sm uppercase tracking-widest font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
        </div>

        <ListingForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
}
