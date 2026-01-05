"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Heart,
  Share2,
  Flag,
  Truck,
  Shield,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  Package,
  Gavel,
  TrendingUp,
  AlertCircle,
  ArrowLeft,
  User,
} from "lucide-react";
import { IListing, IBid } from "@/lib/types/listing.types";
import {
  fetchListingById,
  getMainImage,
  formatCondition,
  getTimeRemaining,
  isAuctionEnded,
  isAuctionStarted,
  getMinimumBid,
  getBidHistory,
  placeBid,
} from "@/services/listings";
import { useAuthStore } from "@/lib/stores/authStore";

export default function AuctionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<IListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { user } = useAuthStore();

  // Bidding state
  const [bidAmount, setBidAmount] = useState<string>("");
  const [bidding, setBidding] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState(false);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchAuction();
    }
  }, [params.id]);

  // Updated timer logic
  useEffect(() => {
    if (!listing?.endTime) return;

    // Function to calculate and update the state
    const updateTimer = () => {
      const remaining = getTimeRemaining(listing.endTime);
      setTimeRemaining(remaining);

      // If the auction has ended, we can stop the interval
      if (isAuctionEnded(listing.endTime)) {
        clearInterval(interval);
      }
    };

    // Initial call to prevent the 1s delay
    updateTimer();

    // Set up the interval
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [listing?.endTime]); // Re-runs if endTime changes (e.g., extension)

  const fetchAuction = async () => {
    try {
      setLoading(true);
      const data = await fetchListingById(params.id as string);

      // If it's not an auction, redirect to listing page
      if (data.type !== "AUCTION") {
        router.push(`/listing/${params.id}`);
        return;
      }

      setListing(data);
      const mainImageUrl = getMainImage(data);
      setActiveImage(mainImageUrl);

      // Set initial bid amount to minimum bid
      const minBid = getMinimumBid(data);
      setBidAmount(minBid.toString());
    } catch (error) {
      console.error("Failed to fetch auction:", error);
      setError("Failed to load auction details.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (direction: "next" | "prev") => {
    if (!listing?.images) return;

    const newIndex =
      direction === "next"
        ? (activeImageIndex + 1) % listing.images.length
        : (activeImageIndex - 1 + listing.images.length) %
          listing.images.length;

    setActiveImageIndex(newIndex);
    setActiveImage(listing.images[newIndex].url);
  };

  const handlePlaceBid = async () => {
    if (!listing) return;

    setBidding(true);
    setBidError(null);
    setBidSuccess(false);

    try {
      const amount = parseFloat(bidAmount);
      const minBid = getMinimumBid(listing);

      if (amount < minBid) {
        setBidError(`Minimum bid is $${minBid.toLocaleString()}`);
        setBidding(false);
        return;
      }

      const response = await placeBid({
        listingId: listing._id,
        bidderId: user?._id!,
        amount,
      });

      // Update listing with new data (this will also update the timer via useEffect)
      setListing(response.listing);
      setBidSuccess(true);

      // Set new minimum bid
      const newMinBid = getMinimumBid(response.listing);
      setBidAmount(newMinBid.toString());

      // Show success message
      setTimeout(() => setBidSuccess(false), 5000);

      if (response.extended) {
        alert(
          `Auction extended! ${
            response.extensionsRemaining || 0
          } extensions remaining.`
        );
      }
    } catch (error: any) {
      console.error("Failed to place bid:", error);
      setBidError(error.message || "Failed to place bid");
    } finally {
      setBidding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c8a882] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#5a524b]">Loading auction...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-[#3a3735] mb-4">Auction Not Found</h2>
          <p className="text-[#5a524b] mb-6">
            {error || "This auction does not exist."}
          </p>
          <button
            onClick={() => router.push("/search")}
            className="px-6 py-3 bg-[#3a3735] text-white hover:bg-[#c8a882] transition-colors"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const seller = typeof listing.seller === "object" ? listing.seller : null;
  const category =
    typeof listing.category === "object" ? listing.category : null;
  const auctionEnded = isAuctionEnded(listing.endTime);
  const auctionStarted = isAuctionStarted(listing.startTime);
  const minBid = getMinimumBid(listing);
  const bidHistory = getBidHistory(listing);
  const isHighestBidder = listing.highestBidder === user?._id;
  const isSeller = seller?._id === user?._id;

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#d4cec4]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#5a524b] hover:text-[#c8a882] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div>
            <div className="bg-white p-4 mb-4">
              <div className="relative aspect-square bg-[#e8dfd0] overflow-hidden group">
                <img
                  src={activeImage}
                  alt={listing.name || "Auction item"}
                  className="object-cover h-full w-full"
                />

                {/* Navigation Arrows */}
                {listing.images && listing.images.length > 1 && (
                  <>
                    <button
                      onClick={() => handleImageChange("prev")}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <ChevronLeft className="w-5 h-5 text-[#3a3735]" />
                    </button>
                    <button
                      onClick={() => handleImageChange("next")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <ChevronRight className="w-5 h-5 text-[#3a3735]" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {listing.images && listing.images.length > 1 && (
              <div className="grid grid-cols-6 gap-2">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveImage(image.url);
                      setActiveImageIndex(index);
                    }}
                    className={`aspect-square bg-[#e8dfd0] overflow-hidden border-2 transition-all ${
                      activeImageIndex === index
                        ? "border-[#c8a882]"
                        : "border-transparent hover:border-[#d4cec4]"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `Thumbnail ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auction Details */}
          <div>
            <div className="bg-white p-6 mb-4">
              {/* Category */}
              {category && (
                <div className="text-sm text-[#5a524b] mb-2">
                  {category.name}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl font-serif text-[#3a3735] mb-4">
                {listing.name}
              </h1>

              {/* Stats */}
              <div className="flex items-center gap-6 mb-6 text-sm text-[#5a524b]">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{listing.totalBids || 0} bids</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{listing.views || 0} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#c8a882] text-[#c8a882]" />
                  <span>{seller?.rating?.toFixed(1) || "New"}</span>
                </div>
              </div>

              {/* Current Price */}
              <div className="mb-6">
                <div className="text-sm text-[#5a524b] mb-1">
                  {listing.currentPrice ? "Current Bid" : "Starting Bid"}
                </div>
                <div className="text-4xl font-serif text-[#c8a882]">
                  $
                  {(
                    listing.currentPrice || listing.startingPrice
                  )?.toLocaleString()}
                </div>
              </div>

              {/* Time Remaining */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-[#5a524b]" />
                  <span className="text-sm text-[#5a524b]">
                    {auctionEnded
                      ? "Auction Ended"
                      : auctionStarted
                      ? "Time Remaining"
                      : "Starts In"}
                  </span>
                </div>
                <div
                  className={`text-2xl font-medium ${
                    auctionEnded ? "text-red-600" : "text-[#3a3735]"
                  }`}
                >
                  {auctionEnded ? "ENDED" : timeRemaining || "Loading..."}
                </div>
              </div>

              {/* Status Alerts */}
              {isHighestBidder && !auctionEnded && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-900">
                      You're the highest bidder!
                    </div>
                    <div className="text-sm text-green-700">
                      Keep monitoring to stay ahead.
                    </div>
                  </div>
                </div>
              )}

              {isSeller && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    You're the seller of this auction.
                  </div>
                </div>
              )}

              {/* Condition */}
              <div className="mb-6">
                <div className="text-sm text-[#5a524b] mb-2">Condition</div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5f1ea] text-[#3a3735]">
                  <CheckCircle2 className="w-4 h-4 text-[#c8a882]" />
                  <span className="font-medium">
                    {formatCondition(listing.condition)}
                  </span>
                </div>
              </div>

              {/* Bidding Section */}
              {!auctionEnded && auctionStarted && !isSeller && (
                <div className="mb-6 p-4 bg-[#f5f1ea]">
                  <div className="text-sm text-[#5a524b] mb-3">
                    Minimum bid:{" "}
                    <span className="font-medium text-[#3a3735]">
                      ${minBid.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-3 mb-3">
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      step={listing.bidIncrement || 1}
                      min={minBid}
                      className="flex-1 px-4 py-3 bg-white border border-[#d4cec4] text-[#3a3735] focus:outline-none focus:border-[#c8a882]"
                      placeholder={`Enter bid amount (min $${minBid})`}
                    />
                    <button
                      onClick={handlePlaceBid}
                      disabled={bidding || parseFloat(bidAmount) < minBid}
                      className="px-8 py-3 bg-[#3a3735] text-white hover:bg-[#c8a882] hover:text-[#3a3735] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                    >
                      <Gavel className="w-5 h-5" />
                      {bidding ? "Placing..." : "Place Bid"}
                    </button>
                  </div>

                  {bidError && (
                    <div className="text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {bidError}
                    </div>
                  )}

                  {bidSuccess && (
                    <div className="text-sm text-green-600 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Bid placed successfully!
                    </div>
                  )}
                </div>
              )}

              {auctionEnded && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200">
                  <div className="font-medium text-red-900 mb-1">
                    Auction Ended
                  </div>
                  <div className="text-sm text-red-700">
                    {listing.highestBidder
                      ? "Winner will be contacted by seller."
                      : "No bids were placed."}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button className="py-3 border border-[#d4cec4] text-[#3a3735] hover:bg-[#f5f1ea] transition-colors flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button className="py-3 border border-[#d4cec4] text-[#3a3735] hover:bg-[#f5f1ea] transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>

              {/* Features */}
              <div className="space-y-3 pt-6 border-t border-[#d4cec4]">
                <div className="flex items-center gap-3 text-sm text-[#5a524b]">
                  <Truck className="w-5 h-5 text-[#c8a882]" />
                  <span>Shipping available after auction</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#5a524b]">
                  <Shield className="w-5 h-5 text-[#c8a882]" />
                  <span>Authenticity guaranteed</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#5a524b]">
                  <Package className="w-5 h-5 text-[#c8a882]" />
                  <span>Secure packaging and handling</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Bid History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 mb-6">
              <h2 className="text-2xl font-serif text-[#3a3735] mb-4">
                Description
              </h2>
              <div className="text-[#5a524b] leading-relaxed whitespace-pre-line">
                {listing.description}
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-white p-6">
              <h2 className="text-2xl font-serif text-[#3a3735] mb-4">
                Bid History ({bidHistory.length})
              </h2>
              {bidHistory.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bidHistory.map((bid, index) => {
                    const bidder =
                      typeof bid.bidder === "object" ? bid.bidder : null;
                    const isCurrentUser = bid.bidder === user?._id;

                    return (
                      <div
                        key={bid._id || index}
                        className={`flex items-center justify-between p-3 border border-[#d4cec4] ${
                          index === 0 ? "bg-[#f5f1ea]" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#c8a882] rounded-full flex items-center justify-center text-white text-sm">
                            {bidder?.username?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <div className="font-medium text-[#3a3735]">
                              {isCurrentUser
                                ? "You"
                                : bidder?.username || "Anonymous"}
                              {index === 0 && (
                                <span className="ml-2 text-xs text-[#c8a882]">
                                  (Highest)
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-[#5a524b]">
                              {bid.timestamp
                                ? new Date(bid.timestamp).toLocaleString()
                                : "Just now"}
                            </div>
                          </div>
                        </div>
                        <div className="font-medium text-[#3a3735] text-lg">
                          ${bid.amount.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-[#5a524b]">
                  <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No bids yet. Be the first to bid!</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6">
              <h3 className="text-lg font-medium text-[#3a3735] mb-4">
                Auction Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#5a524b]">Starting Bid:</span>
                  <span className="text-[#3a3735] font-medium">
                    ${listing.startingPrice?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5a524b]">Bid Increment:</span>
                  <span className="text-[#3a3735] font-medium">
                    ${listing.bidIncrement?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5a524b]">Condition:</span>
                  <span className="text-[#3a3735] font-medium">
                    {formatCondition(listing.condition)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5a524b]">Status:</span>
                  <span className="text-[#3a3735] font-medium capitalize">
                    {listing.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5a524b]">Started:</span>
                  <span className="text-[#3a3735] font-medium">
                    {listing.startTime
                      ? new Date(listing.startTime).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5a524b]">Ends:</span>
                  <span className="text-[#3a3735] font-medium">
                    {listing.endTime
                      ? new Date(listing.endTime).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6">
              <button className="w-full py-3 border border-[#d4cec4] text-[#3a3735] hover:bg-[#f5f1ea] transition-colors flex items-center justify-center gap-2">
                <Flag className="w-4 h-4" />
                <span>Report this auction</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
