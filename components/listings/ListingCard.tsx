"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Eye, Gavel, Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  IListing,
  ListingStatus,
  ListingTypes,
  ImageTypes,
} from "@/lib/types/listing.types"; // Adjust this import path to where you saved the types above

interface ListingCardProps {
  listing: IListing;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onBoost?: (id: string) => void;
  showActions?: boolean;
  variant?: "default" | "compact";
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onEdit,
  onDelete,
  onBoost,
  showActions = true,
  variant = "default",
}) => {
  const router = useRouter();

  const getDisplayPrice = () => {
    if (listing.type === ListingTypes.AUCTION) {
      return listing.currentPrice || listing.startingPrice || 0;
    }
    return listing.buyNowPrice || 0;
  };

  const displayPrice = getDisplayPrice();

  // Get Main Image
  const mainImage =
    listing.images?.find((img) => img.type === ImageTypes.MAIN) ||
    listing.images?.[0];

  // Safely get Category Name (handling populated vs string ID)
  const categoryName =
    typeof listing.category === "object" && listing.category !== null
      ? listing.category.name
      : "Uncategorized";

  // 2. Helper for Status UI
  const getStatusBadge = () => {
    const baseClass =
      "absolute top-3 left-3 px-3 py-1 text-[10px] uppercase tracking-widest font-medium backdrop-blur-md z-10";

    switch (listing.status) {
      case ListingStatus.ACTIVE:
        return listing.type === ListingTypes.AUCTION ? (
          <span className={`${baseClass} bg-[#3a3735] text-white`}>
            Laufende Auktion
          </span>
        ) : (
          <span className={`${baseClass} bg-white/90 text-[#3a3735]`}>
            Sofort-Kauf
          </span>
        );
      case ListingStatus.SOLD:
        return (
          <span className={`${baseClass} bg-[#3a3735] text-[#c8a882]`}>
            Verkauft
          </span>
        );
      case ListingStatus.DRAFT:
        return (
          <span className={`${baseClass} bg-gray-200 text-gray-600`}>
            Entwurf
          </span>
        );
      case ListingStatus.PENDING:
        return (
          <span className={`${baseClass} bg-amber-100 text-amber-800`}>
            Ausstehend
          </span>
        );
      default:
        return null;
    }
  };

  // --- Variant 1: Compact (List View) ---
  if (variant === "compact") {
    return (
      <div
        onClick={() => router.push(`/listings/${listing._id}`)}
        className="flex items-center gap-4 p-4 bg-white border-b border-[#d4cec4] hover:bg-[#faf8f4] transition-colors cursor-pointer group"
      >
        <div className="relative w-16 h-16 bg-[#f5f1ea] overflow-hidden shrink-0">
          {mainImage && (
            <img
              src={mainImage.url}
              alt={listing.name || "Listing image"}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-[#3a3735] font-medium truncate group-hover:text-[#c8a882] transition-colors">
            {listing.name}
          </h3>
          <p className="text-sm text-[#5a524b]">
            CHF {displayPrice.toLocaleString()}
          </p>
        </div>
        <div className="text-xs uppercase tracking-widest text-[#5a524b]">
          {listing.status}
        </div>
      </div>
    );
  }

  // --- Variant 2: Default (Gallery Card) ---
  return (
    <div className="group bg-white border border-[#d4cec4] hover:border-[#c8a882] transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-md">
      {/* Image Container */}
      <div
        className="relative bg-[#f5f1ea] overflow-hidden cursor-pointer"
        onClick={() => router.push(`/dashboard/listings/${listing._id}`)}
      >
        {mainImage ? (
          <img
            src={mainImage.url}
            alt={listing.name || "Listing"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#d4cec4]">
            <span className="font-serif italic text-lg">Kein Bild</span>
          </div>
        )}

        {/* Badges */}
        {getStatusBadge()}

        {/* Check if boosted (simplified check) */}
        {listing.boost && listing.boost.length > 0 && (
          <span
            className="absolute top-3 right-3 w-6 h-6 bg-[#c8a882] text-[#3a3735] flex items-center justify-center rounded-full shadow-lg z-10"
            title="Boosted"
          >
            <Rocket className="w-3 h-3" />
          </span>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-[#3a3735]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="bg-white px-6 py-2 text-xs uppercase tracking-widest font-medium text-[#3a3735] shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Details ansehen
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-auto">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] uppercase tracking-widest text-[#c8a882] font-medium truncate max-w-[70%]">
              {categoryName}
            </span>
            {listing.type === ListingTypes.AUCTION && (
              <Gavel className="w-3 h-3 text-[#5a524b]" />
            )}
          </div>

          <h3
            className="text-lg text-[#3a3735] leading-snug mb-2 cursor-pointer hover:text-[#c8a882] transition-colors line-clamp-2"
            style={{ fontFamily: "Playfair Display, serif" }}
            onClick={() => router.push(`/listings/${listing._id}`)}
          >
            {listing.name}
          </h3>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg font-medium text-[#3a3735]">
              CHF {displayPrice.toLocaleString()}
            </span>
            {listing.type === ListingTypes.AUCTION && (
              <span className="text-xs text-[#5a524b]">Aktuelles Gebot</span>
            )}
          </div>
        </div>

        {showActions && (
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#d4cec4]">
            {onEdit && (
              <Button
                onClick={() => onEdit(listing._id)}
                variant="outline"
                className="h-8 text-xs border-[#d4cec4]"
              >
                Bearbeiten
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={() => onDelete(listing._id)}
                variant="ghost"
                className="h-8 text-xs text-red-700 hover:bg-red-50 hover:text-red-800"
              >
                Löschen
              </Button>
            )}
            {onBoost &&
              listing.status === ListingStatus.ACTIVE &&
              (!listing.boost || listing.boost.length === 0) && (
                <Button
                  onClick={() => onBoost(listing._id)}
                  variant="secondary"
                  className="col-span-2 h-8 text-xs"
                >
                  Inserat boosten
                </Button>
              )}
          </div>
        )}
      </div>
    </div>
  );
};
