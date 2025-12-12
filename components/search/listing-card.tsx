"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Clock, TrendingUp, Eye } from "lucide-react";
import { getListingUrl } from "@/services/listings"; // Ensure this path is correct

// You can share types in a separate file, but defining here for clarity
interface ListingCardProps {
  listing: any; // Replace 'any' with your actual Listing interface if available globally
}

export const ListingCard = ({ listing }: ListingCardProps) => {
  const isAuction = listing.type === "AUCTION";

  // --- TIMER LOGIC ---
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isLastMinute, setIsLastMinute] = useState(false);

  useEffect(() => {
    if (!isAuction || !listing.endTime) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const end = new Date(listing.endTime).getTime();
      const diff = end - now;

      if (diff <= 0) return "Ended";

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Check if last minute
      setIsLastMinute(diff < 60000);

      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m ${seconds}s`;
    };

    setTimeLeft(calculateTime());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [listing.endTime, isAuction]);
  // -------------------

  const displayPrice = isAuction ? listing.currentPrice : listing.buyNowPrice;
  const priceLabel = isAuction ? "Current Bid" : "Buy Now";
  const listingUrl = getListingUrl(listing);

  return (
    <Link
      href={listingUrl}
      className="group bg-white hover:bg-[#f5f1ea] cursor-pointer transition-all shadow-sm hover:shadow-lg flex flex-col h-full"
    >
      <div className="relative aspect-square overflow-hidden bg-[#e8dfd0]">
        {listing.isBoosted && (
          <div className="absolute top-2 left-2 bg-[#c8a882] text-white px-2 py-1 text-xs z-10 font-medium">
            FEATURED
          </div>
        )}
        <img
          src={listing.images[0]?.url || "/placeholder.jpg"}
          alt={listing.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-[#c8a882] hover:text-white transition-colors rounded-full"
        >
          <Heart className="w-4 h-4" strokeWidth={1.5} />
        </button> */}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h4 className="text-[#3a3735] mb-2 text-sm line-clamp-2 group-hover:text-[#c8a882] transition-colors font-serif min-h-[40px]">
          {listing.name}
        </h4>

        <div className="flex items-center justify-between text-xs mb-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-[#5a524b]/60 text-[10px]">{priceLabel}</span>
            <span className="text-[#c8a882] font-medium text-base">
              ${displayPrice?.toLocaleString()}
            </span>
          </div>

          {isAuction && listing.endTime && (
            <div
              className={`flex items-center gap-1 ${
                isLastMinute
                  ? "text-red-600 font-bold animate-pulse"
                  : "text-[#5a524b]"
              }`}
            >
              <Clock className="w-3 h-3" strokeWidth={1.5} />
              <span>{timeLeft}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-[#5a524b] pt-2 border-t border-[#f0ebe0]">
          {isAuction && (
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{listing.totalBids} bids</span>
            </div>
          )}
          <div className="flex items-center gap-1 ml-auto">
            <Eye className="w-3 h-3" />
            <span>{listing.views}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
