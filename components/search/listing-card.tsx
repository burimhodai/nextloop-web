"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Clock, TrendingUp, Eye } from "lucide-react";
import { getListingUrl, toggleWatchlist } from "@/services/listings";
import { useAuthStore } from "@/lib/stores/authStore";

interface ListingCardProps {
  listing: any;
  isInWatchlist?: boolean;
  onWatchlistChange?: (listingId: string, isInWatchlist: boolean) => void;
}

export const ListingCard = ({
  listing,
  isInWatchlist: initialIsInWatchlist = false,
  onWatchlistChange,
}: ListingCardProps) => {
  const { user, token, isAuthenticated } = useAuthStore();
  const isAuction = listing.type === "AUCTION";

  // Wishlist state
  const [isInWatchlist, setIsInWatchlist] = useState(initialIsInWatchlist);
  const [isTogglingWatchlist, setIsTogglingWatchlist] = useState(false);

  // Timer state
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isLastMinute, setIsLastMinute] = useState(false);

  useEffect(() => {
    setIsInWatchlist(initialIsInWatchlist);
  }, [initialIsInWatchlist]);

  // Timer logic
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

      setIsLastMinute(diff < 60000);

      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m ${seconds}s`;
    };

    setTimeLeft(calculateTime());

    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [listing.endTime, isAuction]);

  // Handle watchlist toggle
  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !user) {
      // Redirect to login or show message
      window.location.href = "/auth/login";
      return;
    }

    if (isTogglingWatchlist) return;

    setIsTogglingWatchlist(true);

    try {
      const response = await toggleWatchlist(
        listing._id,
        user._id,
        token || undefined
      );
      const newIsInWatchlist = response.isInWatchlist ?? !isInWatchlist;

      setIsInWatchlist(newIsInWatchlist);

      // Call parent callback if provided
      if (onWatchlistChange) {
        onWatchlistChange(listing._id, newIsInWatchlist);
      }

      // Optional: Show success toast
      console.log(response.message);
    } catch (error) {
      console.error("Failed to toggle watchlist:", error);
      // Optional: Show error toast
    } finally {
      setIsTogglingWatchlist(false);
    }
  };

  const displayPrice = isAuction ? listing.currentPrice : listing.buyNowPrice;
  const priceLabel = isAuction ? "Current Bid" : "Buy Now";
  const listingUrl = getListingUrl(listing);

  return (
    <Link
      href={listingUrl}
      className="group bg-white hover:bg-[#f5f1ea] cursor-pointer transition-all shadow-sm hover:shadow-lg flex flex-col h-full rounded-lg overflow-hidden border border-[#e8dfd0]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#e8dfd0]">
        {listing.isBoosted && (
          <div className="absolute top-2 left-2 bg-[#c8a882] text-white px-2 py-1 text-xs z-10 font-medium rounded">
            FEATURED
          </div>
        )}
        <img
          src={listing.images[0]?.url || "/placeholder.jpg"}
          alt={listing.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={handleWatchlistToggle}
          disabled={isTogglingWatchlist}
          className={`absolute top-2 right-2 w-9 h-9 backdrop-blur-sm flex items-center justify-center transition-all rounded-full ${
            isInWatchlist
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-white/90 text-[#5a524b] hover:bg-[#c8a882] hover:text-white"
          } ${isTogglingWatchlist ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Heart
            className={`w-4 h-4 ${isInWatchlist ? "fill-current" : ""}`}
            strokeWidth={1.5}
          />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h4 className="text-[#3a3735] mb-2 text-sm line-clamp-2 group-hover:text-[#c8a882] transition-colors font-serif min-h-[40px]">
          {listing.name}
        </h4>

        <div className="flex items-center justify-between text-xs mb-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-[#5a524b]/60 text-[10px]">{priceLabel}</span>
            <span className="text-[#c8a882] font-semibold text-base">
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
