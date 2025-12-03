// app/listing/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { Button } from "@/components/ui/Button";
import {
  Heart,
  Share2,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Clock,
  Gavel,
} from "lucide-react";
import {
  IListing,
  ListingTypes,
  ListingStatus,
  ImageTypes,
} from "@/lib/types/listing.types";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token, user } = useAuthStore();

  // 1. Fix State Type (IListin -> IListing)
  const [listing, setListing] = useState<IListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [bidAmount, setBidAmount] = useState<number>(0);

  useEffect(() => {
    if (params.id) fetchListing();
  }, [params.id]);

  const fetchListing = async () => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/listing/${params.id}`);

      if (response.ok) {
        const data: IListing = await response.json();
        setListing(data);

        // 2. Fix Image Logic (Safe navigation)
        const main =
          data.images?.find((img) => img.type === ImageTypes.MAIN)?.url ||
          data.images?.[0]?.url;

        setActiveImage(main || "");

        // 3. Fix Price Logic for Bid Default
        if (data.type === ListingTypes.AUCTION) {
          const current = data.currentPrice || data.startingPrice || 0;
          setBidAmount(current + (data.bidIncrement || 10));
        }
      }
    } catch (error) {
      console.error("Failed to fetch listing", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyOrBid = () => {
    if (!token) {
      router.push("/auth/login");
      return;
    }
    //

    alert("Integration point: Process Payment or Place Bid");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c8a882]"></div>
      </div>
    );
  }

  if (!listing) return null;

  // 4. Helper to determine which price to show
  const getDisplayPrice = () => {
    if (listing.type === ListingTypes.AUCTION) {
      return listing.currentPrice || listing.startingPrice || 0;
    }
    return listing.buyNowPrice || 0;
  };

  const displayPrice = getDisplayPrice();

  // 5. Handle Seller Check (Seller might be string ID or Object)
  const isOwner =
    typeof listing.seller === "object"
      ? user?._id === listing.seller?._id
      : user?._id === listing.seller;

  const sellerName =
    typeof listing.seller === "object"
      ? listing.seller.fullName
      : "Verified Seller";
  //   const sellerAvatar = typeof listing.seller === 'object' ? listing.seller. : null;
  const categoryName =
    typeof listing.category === "object"
      ? listing.category.name
      : "Uncategorized";

  return (
    <div className="min-h-screen bg-[#faf8f4] pb-20">
      {/* Breadcrumb / Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-xs uppercase tracking-widest text-[#5a524b] hover:text-[#c8a882] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT COLUMN: IMAGES (8 Columns) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Main Image Stage */}
            <div className="aspect-[4/5] md:aspect-square relative bg-[#f5f1ea] overflow-hidden group">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={listing.name || "Listing Item"}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#d4cec4]">
                  No Image
                </div>
              )}

              {/* Floating Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-[#3a3735] hover:bg-[#c8a882] hover:text-white transition-all shadow-sm">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-[#3a3735] hover:text-red-500 transition-all shadow-sm">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-4">
              {listing.images?.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(img.url)}
                  className={`aspect-square cursor-pointer overflow-hidden border-2 transition-all ${
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

            {/* Description */}
            <div className="pt-10 border-t border-[#d4cec4] space-y-6">
              <h3 className="text-xl font-serif text-[#3a3735]">Description</h3>
              <div className="prose prose-stone text-[#5a524b] leading-relaxed max-w-none">
                <p className="whitespace-pre-line">{listing.description}</p>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
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
                    Reference
                  </span>
                  <span className="block text-[#3a3735] font-medium font-mono text-sm">
                    #{listing._id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-widest text-[#9ca3af] mb-1">
                    Posted
                  </span>
                  <span className="block text-[#3a3735] font-medium">
                    {listing.createdAt
                      ? new Date(listing.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: INFO & PURCHASE (4 Columns) */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-8">
              {/* Header Info */}
              <div>
                <span className="text-[#c8a882] text-xs uppercase tracking-widest font-bold mb-2 block">
                  {categoryName}
                </span>
                <h1
                  className="text-3xl md:text-4xl text-[#3a3735] mb-4"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {listing.name}
                </h1>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#d4cec4] overflow-hidden"></div>
                  <p className="text-sm text-[#5a524b]">
                    Listed by{" "}
                    <span className="text-[#3a3735] font-medium underline decoration-[#c8a882] decoration-2 underline-offset-4">
                      {sellerName}
                    </span>
                  </p>
                </div>
              </div>

              {/* Purchase Card */}
              <div className="bg-white p-8 border border-[#d4cec4] shadow-sm relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#3a3735]" />

                <div className="mb-6">
                  <p className="text-sm text-[#5a524b] mb-1">
                    {listing.type === ListingTypes.AUCTION
                      ? "Current Bid"
                      : "Price"}
                  </p>
                  <p
                    className="text-4xl text-[#3a3735] font-medium"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    CHF {displayPrice.toLocaleString()}
                  </p>
                  {listing.type === ListingTypes.AUCTION && listing.endTime && (
                    <div className="mt-3 inline-flex items-center text-xs font-medium text-red-700 bg-red-50 px-2 py-1 rounded">
                      <Clock className="w-3 h-3 mr-1" />
                      Ends {new Date(listing.endTime).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {listing.type === ListingTypes.AUCTION ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a524b] font-medium">
                        CHF
                      </span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        className="w-full h-12 pl-12 pr-4 bg-[#f5f1ea] border border-[#d4cec4] focus:border-[#c8a882] focus:outline-none text-[#3a3735] font-medium"
                      />
                    </div>
                    <Button
                      onClick={handleBuyOrBid}
                      disabled={
                        isOwner || listing.status !== ListingStatus.ACTIVE
                      }
                      className="w-full py-4 text-base bg-[#3a3735] hover:bg-[#c8a882] text-white"
                    >
                      {isOwner ? "You Own This Item" : "Place Bid"}
                    </Button>
                    <p className="text-xs text-center text-[#9ca3af]">
                      Minimum bid: CHF{" "}
                      {(
                        displayPrice + (listing.bidIncrement || 10)
                      ).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button
                      onClick={handleBuyOrBid}
                      disabled={
                        isOwner || listing.status === ListingStatus.SOLD
                      }
                      className="w-full py-4 text-base bg-[#3a3735] hover:bg-[#c8a882] text-white"
                    >
                      {isOwner
                        ? "You Own This Item"
                        : listing.status === ListingStatus.SOLD
                        ? "Item Sold"
                        : "Purchase Now"}
                    </Button>
                  </div>
                )}

                {/* Trust Indicators */}
                <div className="mt-8 space-y-4 pt-6 border-t border-dashed border-[#d4cec4]">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#c8a882] flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-[#3a3735] uppercase tracking-wide">
                        Authenticity Guarantee
                      </h4>
                      <p className="text-xs text-[#5a524b] mt-1">
                        Every item is verified by our team of experts before
                        shipping.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-[#c8a882] flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-[#3a3735] uppercase tracking-wide">
                        Insured Shipping
                      </h4>
                      <p className="text-xs text-[#5a524b] mt-1">
                        Fully insured global shipping via secure courier
                        partners.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
