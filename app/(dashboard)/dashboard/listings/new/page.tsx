"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { ListingForm } from "@/components/listings/ListingForm";
import { ListingTypes, ImageTypes } from "@/lib/types/listing.types";
import { ArrowLeft } from "lucide-react";
import type { ListingFormData } from "@/components/listings/ListingForm";

export default function CreateListingPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();

  const handleSubmit = async (formData: ListingFormData) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const payload = new FormData();

      // Add images
      Object.values(ImageTypes).forEach((type) => {
        const file = formData.images[type];
        if (file) payload.append(type, file);
      });

      payload.append("userId", user?._id || "");
      payload.append("name", formData.title);
      payload.append("description", formData.description);

      const categoryId =
        typeof formData.category === "object"
          ? // @ts-ignore
            formData.category._id || formData.category.id
          : String(formData.category);

      payload.append("category", categoryId);
      if (user?._id) payload.append("seller", user._id);
      payload.append("condition", formData.condition);
      payload.append("type", formData.type);
      payload.append("status", "ACTIVE");

      if (formData.type === ListingTypes.DIRECT_BUY) {
        payload.append("buyNowPrice", formData.price.toString());
        payload.append("startingPrice", "0");
      } else if (formData.type === ListingTypes.AUCTION) {
        payload.append("startingPrice", formData.price.toString());
        payload.append("currentPrice", formData.price.toString());
        payload.append("bidIncrement", "10");
        const endTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        payload.append("endTime", endTime.toISOString());
      }

      const response = await fetch(`${API_URL}/listing/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create listing");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating listing:", error);
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <button
            onClick={() => router.push("/dashboard")}
            className="group flex items-center text-[#5a524b] hover:text-[#3a3735] transition-colors text-xs uppercase tracking-[0.2em] font-bold"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Back to Collection
          </button>
        </div>

        <ListingForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/dashboard")}
        />
      </div>
    </div>
  );
}
