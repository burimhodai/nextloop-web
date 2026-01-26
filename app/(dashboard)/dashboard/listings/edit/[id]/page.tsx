// app/listing/[id]/edit/page.tsx
"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ListingForm,
  ListingFormData,
} from "@/components/listings/ListingForm";
import { Loader2, AlertCircle, Ban } from "lucide-react";

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const { user, token } = useAuthStore();
  const listingId = params.id as string;

  const [listing, setListing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (listingId && token) {
      fetchListing();
    }
  }, [listingId, token]);

  const fetchListing = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/listing/${listingId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch listing");
      }

      const data = await response.json();

      // Check if user owns this listing
      if (data.seller._id !== user?._id && data.seller !== user?._id) {
        setError("You don't have permission to edit this listing");
        return;
      }

      setListing(data);
    } catch (err) {
      console.error("Error fetching listing:", err);
      setError("Failed to load listing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: ListingFormData) => {
    try {
      const formData = new FormData();

      // Add all the form fields
      formData.append("name", data.title);
      formData.append("description", data.description);
      formData.append("condition", data.condition);
      formData.append("category", data.category);
      formData.append("buyNowPrice", data.price.toString());

      // Add new images if any
      Object.entries(data.images).forEach(([type, file]) => {
        if (file) {
          formData.append("images", file);
          formData.append("imageTypes", type);
        }
      });

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/listing/edit/${listingId}`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update listing");
      }

      const result = await response.json();

      // Redirect to the listing
      router.push(`/listing/${result._id}`);
    } catch (error) {
      console.error("Error updating listing:", error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push(`/listing/${listingId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#c8a882] animate-spin mx-auto mb-4" />
          <p className="text-[#5a524b]">Liste wird geladen...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-[#d4cec4] rounded-lg p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" strokeWidth={1.5} />
          </div>
          <h2
            className="text-2xl font-semibold text-[#3a3735] mb-3"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Eintrag kann nicht bearbeitet werden
          </h2>
          <p className="text-[#5a524b] mb-6">{error}</p>
          <button
            onClick={() => router.push("/dashboard/listings")}
            className="px-6 py-3 bg-[#3a3735] text-[#c8a882] rounded-lg hover:bg-[#c8a882] hover:text-[#3a3735] transition-all font-medium"
          >
            Zurück zu meinen Angeboten
          </button>
        </div>
      </div>
    );
  }

  // Check if listing is an auction
  if (listing?.type === "AUCTION") {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white border border-[#d4cec4] rounded-lg p-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ban className="w-10 h-10 text-amber-600" strokeWidth={1.5} />
            </div>
            <h2
              className="text-2xl font-semibold text-[#3a3735] mb-3"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Auktionen können nicht bearbeitet werden.
            </h2>
            <p className="text-[#5a524b] leading-relaxed">
              Sobald eine Auktion live ist, kann sie nicht mehr bearbeitet
              werden, um die Fairness für alle Bieter zu gewährleisten. Jegliche
              Änderungen an den Auktionsdetails können sich auf laufende Gebote
              und Bietstrategien auswirken.
            </p>
          </div>

          <div className="bg-[#f5f1ea] border border-[#d4cec4] rounded-lg p-6 mb-6">
            <h3 className="text-sm font-semibold text-[#3a3735] mb-3 uppercase tracking-wider">
              Warum kann ich nicht bearbeiten?
            </h3>
            <ul className="space-y-2 text-sm text-[#5a524b]">
              <li className="flex items-start gap-2">
                <span className="text-[#c8a882] mt-0.5">•</span>
                <span>Gewährleistet Fairness für alle Auktionsteilnehmer.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c8a882] mt-0.5">•</span>
                <span>
                  Verhindert die Manipulation von Auktionsbedingungen nach
                  Abgabe von Geboten.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c8a882] mt-0.5">•</span>
                <span>Bewahrt Vertrauen und Integrität auf dem Markt</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c8a882] mt-0.5">•</span>
                <span>
                  Schützt sowohl Verkäufer als auch Bieter vor Streitigkeiten
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Was Sie tun können
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>
                  Sehen Sie sich Ihre Auktionsdetails und aktuellen Gebote an.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>
                  Warten Sie, bis die Auktion endet und die Verkäufe
                  abgeschlossen werden
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>
                  Kontaktieren Sie den Support, wenn Sie die Auktion stornieren
                  müssen
                </span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push(`/listing/${listingId}`)}
              className="flex-1 px-6 py-3 bg-[#3a3735] text-[#c8a882] rounded-lg hover:bg-[#c8a882] hover:text-[#3a3735] transition-all font-medium"
            >
              Auktion ansehen
            </button>
            <button
              onClick={() => router.push("/dashboard/listings")}
              className="flex-1 px-6 py-3 bg-[#f5f1ea] text-[#3a3735] rounded-lg hover:bg-[#e8dfd0] transition-all font-medium"
            >
              Meine Angebote
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Only allow editing BUY_NOW listings
  const initialData: Partial<ListingFormData> = {
    title: listing?.name || "",
    description: listing?.description || "",
    price: listing?.buyNowPrice || 0,
    condition: listing?.condition,
    type: listing?.type,
    category: listing?.category?._id || listing?.category || "",
    images: {}, // Images will be handled separately
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] py-12 px-4">
      <ListingForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEdit={true}
      />
    </div>
  );
}
