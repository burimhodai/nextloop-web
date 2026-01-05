"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { Button } from "@/components/ui/Button";
import {
  Heart,
  Share2,
  ArrowLeft,
  Edit,
  Loader2,
  Eye, // For Views
  Zap, // For Boost status/active
  Calendar, // For Boost duration
  DollarSign, // For Price/Cost
  TrendingUp, // For Impressions
  Target, // For Clicks
  Clock, // For duration
} from "lucide-react";

// Assuming these types are correctly imported from your library
import { IListing, ListingTypes, ImageTypes } from "@/lib/types/listing.types";

// Define a simplified Boost structure based on your data
interface IBoost {
  _id: string;
  type: string;
  duration: number;
  cost: number;
  startTime: string;
  endTime: string;
  status: string;
  impressions: number;
  clicks: number;
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore(); // Removed 'token' and 'actionLoading' as they weren't used below

  const [listing, setListing] = useState<IListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (params.id) fetchListing();
  }, [params.id]);

  const fetchListing = async () => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      // This is the intended real API call:
      const response = await fetch(`${API_URL}/listing/${params.id}`);

      if (!response.ok) throw new Error("Listing not found");

      const data: IListing = await response.json();
      setListing(data);

      const main =
        data.images?.find((img) => img.type === ImageTypes.MAIN)?.url ||
        data.images?.[0]?.url;

      setActiveImage(main || "");
    } catch (error) {
      console.error("Failed to fetch listing", error);
      setError("Failed to load listing details.");
    } finally {
      setLoading(false);
    }
  };

  const getDisplayPrice = () => {
    if (listing?.type === ListingTypes.AUCTION) {
      // Assuming currentPrice is a field on IListing for auction
      return listing.currentPrice || listing.startingPrice || 0;
    }
    return listing?.buyNowPrice || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#c8a882] animate-spin" />
      </div>
    );
  }

  if (!listing) return null;

  const displayPrice = getDisplayPrice();

  // Seller Logic
  const sellerId =
    typeof listing.seller === "object" ? listing.seller?._id : listing.seller;
  const isOwner = user?._id === sellerId; // Should be true in the dashboard

  const categoryName =
    typeof listing.category === "object"
      ? listing.category.name
      : "Uncategorized";

  // FIX: Handle listing.boost as a single object (IBoost | null)
  const boostObject: IBoost | undefined = listing.boost as IBoost | undefined;
  const activeBoost =
    boostObject &&
    boostObject?.status === "ACTIVE" &&
    boostObject?.endTime &&
    new Date(boostObject?.endTime) > new Date()
      ? boostObject
      : null;

  return (
    <div className="min-h-screen bg-[#faf8f4] pb-20">
      {/* Navigation and Edit Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center text-xs uppercase tracking-widest text-[#5a524b] hover:text-[#c8a882] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        {isOwner && (
          <Button
            onClick={() =>
              router.push(`/dashboard/listings/edit/${listing._id}`)
            }
            className="text-xs h-8 bg-[#c8a882] hover:bg-[#a68c74] text-white"
          >
            <Edit className="w-3 h-3 mr-2" /> Edit Listing
          </Button>
        )}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT COLUMN: IMAGES & DESCRIPTION (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              {/* Main Image Stage */}
              <div className="aspect-[4/5] md:aspect-square relative bg-[#f5f1ea] overflow-hidden rounded-sm border border-[#e5e5e5]">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={listing.name || "Listing Item"}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#d4cec4] text-xl font-medium"></div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  {/* Hiding share/heart in owner dashboard for cleaner UI */}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-4">
                {listing.images?.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(img.url)}
                    className={`aspect-square cursor-pointer overflow-hidden border-2 rounded-sm transition-all ${
                      activeImage === img.url
                        ? "border-[#3a3735]"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`View ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Description & Details */}
            <div className="pt-8 border-t border-[#d4cec4] space-y-6">
              <h3 className="text-xl font-serif text-[#3a3735]">Description</h3>
              <div className="prose prose-stone text-[#5a524b] leading-relaxed max-w-none">
                <p className="whitespace-pre-line">{listing.description}</p>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 bg-white p-6 rounded-lg border border-[#e5e5e5]">
                <div>
                  <span className="block text-xs uppercase tracking-widest text-[#9ca3af] mb-1">
                    Condition
                  </span>
                  <span className="block text-[#3a3735] font-medium capitalize">
                    {listing.condition?.replace(/_/g, " ")}
                  </span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-widest text-[#9ca3af] mb-1">
                    Category
                  </span>
                  <span className="block text-[#3a3735] font-medium">
                    {categoryName}
                  </span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-widest text-[#9ca3af] mb-1">
                    Type
                  </span>
                  <span className="block text-[#3a3735] font-medium capitalize">
                    {listing.type?.replace(/_/g, " ")}
                  </span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-widest text-[#9ca3af] mb-1">
                    Listing Status
                  </span>
                  <span className="block text-[#3a3735] font-medium capitalize">
                    {listing.status?.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --- */}

          {/* RIGHT COLUMN: METRICS & ACTIONS (lg:col-span-4) */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-8">
              {/* Header Info */}
              <div>
                <span className="text-[#c8a882] text-xs uppercase tracking-widest font-bold mb-2 block">
                  {categoryName}
                </span>
                <h1 className="text-3xl md:text-4xl text-[#3a3735] mb-2 font-serif">
                  {listing.name}
                </h1>
                <p className="text-sm text-[#5a524b] font-mono">
                  ID: {listing._id}
                </p>
              </div>

              {/* === OWNER METRICS & STATUS CARD === */}
              <div className="bg-[#fffcf7] p-6 border border-[#c8a882] shadow-md rounded-sm space-y-6">
                <h3 className="text-sm font-bold text-[#3a3735] uppercase tracking-wider flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-[#c8a882]" /> Performance
                  Metrics
                </h3>

                {/* Core Metrics */}
                <div className="grid grid-cols-3 gap-4 border-b border-[#e5e5e5] pb-4">
                  <div>
                    <span className="block text-xl font-medium text-[#3a3735]">
                      {listing.views?.toLocaleString() || 0}
                    </span>
                    <span className="text-xs text-[#5a524b]">Total Views</span>
                  </div>
                  <div>
                    <span className="block text-xl font-medium text-[#3a3735]">
                      {listing.totalBids?.toLocaleString() || 0}
                    </span>
                    <span className="text-xs text-[#5a524b]">Total Bids</span>
                  </div>
                  <div>
                    <span className="block text-xl font-medium text-[#3a3735] flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {displayPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#5a524b]">
                      Current Price
                    </span>
                  </div>
                </div>

                {/* --- */}

                {/* Boost Status */}
                <div className="pt-2">
                  <h4 className="text-sm font-bold text-[#3a3735] mb-4 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-[#c8a882]" /> Boost
                    Management
                  </h4>

                  {activeBoost ? (
                    <div className="p-4 bg-white border border-green-200 rounded-md shadow-inner space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-dashed border-green-100">
                        <span className="inline-block px-3 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full uppercase">
                          {activeBoost.type.replace(/_/g, " ")}
                        </span>
                        <span className="text-sm font-semibold text-green-600 flex items-center">
                          <Clock className="w-3 h-3 mr-1" /> ACTIVE
                        </span>
                      </div>

                      {/* Boost Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-sm">
                          <span className="block font-medium text-[#3a3735] flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />{" "}
                            Impressions
                          </span>
                          <span className="block text-xl font-bold ml-6">
                            {activeBoost.impressions?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="block font-medium text-[#3a3735] flex items-center">
                            <Target className="w-4 h-4 mr-2 text-red-500" />{" "}
                            Clicks
                          </span>
                          <span className="block text-xl font-bold ml-6">
                            {activeBoost.clicks?.toLocaleString() || 0}
                          </span>
                        </div>
                      </div>

                      {/* Boost Details */}
                      <div className="pt-2 border-t border-dashed border-[#e5e5e5] space-y-1">
                        <p className="text-xs text-[#5a524b] flex justify-between">
                          <span className="font-semibold">Duration:</span>
                          <span>{activeBoost.duration} days</span>
                        </p>
                        <p className="text-xs text-[#5a524b] flex justify-between">
                          <span className="font-semibold">Total Cost:</span>
                          <span>
                            $
                            {activeBoost.cost.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </p>
                        <p className="text-xs text-[#5a524b] flex justify-between">
                          <span className="font-semibold flex items-center">
                            <Calendar className="w-3 h-3 mr-1" /> Ends:
                          </span>
                          <span className="font-semibold">
                            {new Date(activeBoost.endTime).toLocaleDateString()}
                          </span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-white border border-[#d4cec4] rounded-md text-center">
                      <p className="text-sm text-[#5a524b] mb-3">
                        Not currently boosted. Maximize your visibility!
                      </p>
                      <Button
                        onClick={() =>
                          router.push(`/dashboard/boost/${listing._id}`)
                        }
                        className="w-full bg-[#3a3735] hover:bg-[#c8a882] text-white h-9 text-sm"
                      >
                        Boost Listing Now
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {/* === END: OWNER METRICS & STATUS CARD === */}

              {/* --- */}

              {/* Management Actions */}
              <div className="bg-white p-6 border border-[#d4cec4] shadow-sm relative rounded-sm space-y-3">
                <h4 className="text-sm font-bold text-[#3a3735] uppercase tracking-wider mb-3">
                  Listing Tools
                </h4>
                <Button
                  onClick={() =>
                    router.push(`/dashboard/listings/edit/${listing._id}`)
                  }
                  className="w-full bg-white !text-[#3a3735] border border-[#3a3735] hover:bg-[#3a3735] hover:!text-white"
                >
                  <Edit className="w-4 h-4 mr-2" /> Edit Details
                </Button>
                <Button
                  className="w-full bg-red-600 text-white hover:bg-red-700"
                  onClick={() =>
                    alert("Integration point: Deactivate/Remove Listing")
                  }
                >
                  Cancel Listing
                </Button>

                <div className="mt-6 pt-4 border-t border-dashed border-[#d4cec4]">
                  <p className="text-xs text-[#9ca3af] text-center">
                    This is your private dashboard view.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
