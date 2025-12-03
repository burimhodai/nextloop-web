// app/dashboard/boost/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { BoostModal } from "@/components/listings/BoostModal";

interface Listing {
  _id: string;
  title: string;
  seller: {
    _id: string;
  };
}

export default function BoostListingPage() {
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
      const response = await fetch(`${API_URL}/listing/${listingId}`, {
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
        setError("You can only boost your own listings");
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

  const handleClose = () => {
    router.push("/dashboard");
  };

  const handleSuccess = () => {
    router.push("/dashboard");
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
          <p className="text-[var(--deep-brown)]">Loading...</p>
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
    <BoostModal
      listingId={listing._id}
      listingTitle={listing.title}
      onClose={handleClose}
      onSuccess={handleSuccess}
    />
  );
}
