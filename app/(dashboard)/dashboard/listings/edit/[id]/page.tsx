// app/dashboard/listings/edit/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { ListingForm } from "@/components/listings/ListingForm";

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: Array<{ url: string; type: string }>;
  condition: string;
  type: "DIRECT_BUY" | "AUCTION";
  category: {
    _id: string;
    name: string;
  };
  seller: {
    _id: string;
  };
  status: string;
}

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const { user, token, isAuthenticated } = useAuthStore();
  const listingId = params.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (listingId) {
      fetchListing();
    }
  }, [listingId, isAuthenticated]);

  const fetchListing = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/listings/${listingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Listing not found");
      }

      const data = await response.json();

      // Check if user owns this listing
      if (data.seller._id !== user?._id) {
        setError("You don't have permission to edit this listing");
        setTimeout(() => router.push("/dashboard"), 2000);
        return;
      }

      setListing(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load listing");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      // Handle image updates if new images were added
      const imageUrls: Array<{ url: string; type: string }> = [];

      // Keep existing images
      if (listing?.images) {
        imageUrls.push(...listing.images);
      }

      // Add new images if any
      for (let i = 0; i < formData.images.length; i++) {
        const file = formData.images[i];
        // If it's a File object (new upload), handle it
        if (file instanceof File) {
          // You'll need to implement image upload endpoint
          // For now, using placeholder
          const imageType = imageUrls.length === 0 ? "MAIN" : "DETAILS";
          imageUrls.push({
            url: URL.createObjectURL(file), // Replace with actual upload
            type: imageType,
          });
        }
      }

      // Update listing
      const listingData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        condition: formData.condition,
        type: formData.type,
        category: formData.category,
        images: imageUrls,
      };

      const response = await fetch(`${API_URL}/listings/edit/${listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(listingData),
      });

      if (!response.ok) {
        throw new Error("Failed to update listing");
      }

      // Redirect to listing detail or dashboard
      router.push(`/listing/${listingId}`);
    } catch (error) {
      console.error("Error updating listing:", error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push(`/listing/${listingId}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--ivory)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--charcoal)] mx-auto mb-4"></div>
          <p className="text-[var(--deep-brown)]">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--ivory)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--charcoal)] mx-auto mb-4"></div>
          <p className="text-[var(--deep-brown)]">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-[var(--ivory)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[var(--sand)] rounded-xl shadow-lg p-8 text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
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
          <h2 className="text-xl font-semibold text-[var(--charcoal)] mb-2">
            Error
          </h2>
          <p className="text-[var(--deep-brown)] mb-6">
            {error || "Failed to load listing"}
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-[var(--charcoal)] text-[var(--ivory)] rounded-lg hover:bg-[var(--deep-brown)] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--ivory)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push(`/listing/${listingId}`)}
            className="flex items-center text-[var(--deep-brown)] hover:text-[var(--charcoal)] mb-4 transition-colors"
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
            Back to Listing
          </button>
        </div>

        {/* <ListingForm
          initialData={{
            title: listing.title,
            description: listing.description,
            price: listing.price,
            condition: listing.condition,
            type: listing.type,
            category: listing.category._id,
            images: [], // Don't pre-fill images, let user add new ones
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEdit={true}
        /> */}
      </div>
    </div>
  );
}
