"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Share2,
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
  X,
} from "lucide-react";
import { IListing, IBid } from "@/lib/types/listing.types";
import {
  fetchListingById,
  fetchAuctionBidUpdates,
  incrementListingView,
  getMainImage,
  formatCondition,
  getTimeRemaining,
  isAuctionEnded,
  isAuctionStarted,
  getMinimumBid,
  getBidHistory,
  placeBid,
  toggleWatchlist,
  isInWatchlist,
} from "@/services/listings";
import { useAuthStore } from "@/lib/stores/authStore";

interface AuctionDetailClientProps {
  initialListing: IListing;
}

export default function AuctionDetailClient({
  initialListing,
}: AuctionDetailClientProps) {
  const router = useRouter();
  const [listing, setListing] = useState<IListing>(initialListing);
  const [activeImage, setActiveImage] = useState<string>(
    getMainImage(initialListing),
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { user } = useAuthStore();

  // Bidding state
  const [bidAmount, setBidAmount] = useState<string>(
    getMinimumBid(initialListing).toString(),
  );
  const [bidding, setBidding] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState(false);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<string | null>(
    getTimeRemaining(initialListing.endTime),
  );

  // Watchlist state
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Share modal state
  const [showShareModal, setShowShareModal] = useState(false);

  // Polling ref
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const viewTrackedRef = useRef(false); // Track if view has been recorded

  // Polling effect - refetch only bid updates every 5 seconds
  useEffect(() => {
    if (isAuctionEnded(listing.endTime)) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      return;
    }

    pollingIntervalRef.current = setInterval(() => {
      fetchBidUpdatesSilent();
    }, 5000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [listing._id, listing.endTime]);

  // Timer effect
  useEffect(() => {
    if (!listing?.endTime) return;

    const updateTimer = () => {
      const remaining = getTimeRemaining(listing.endTime);
      setTimeRemaining(remaining);

      if (isAuctionEnded(listing.endTime)) {
        clearInterval(interval);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [listing?.endTime]);

  // Check watchlist status
  useEffect(() => {
    if (listing && user) {
      checkWatchlistStatus();
    }
  }, [listing._id, user?._id]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Track view on first visit
  useEffect(() => {
    if (!viewTrackedRef.current && listing._id) {
      incrementView();
      viewTrackedRef.current = true;
    }
  }, [listing._id]);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    setToast({ message, type });
  };

  const incrementView = async () => {
    try {
      await incrementListingView(listing._id);
      // Silently increment, no need to update UI immediately
      // The view count will update on next poll or page refresh
    } catch (error) {
      console.error("Failed to increment view:", error);
      // Fail silently - view tracking shouldn't disrupt user experience
    }
  };

  const fetchBidUpdatesSilent = async () => {
    try {
      const bidUpdates = await fetchAuctionBidUpdates(listing._id);

      // Calculate current price from bids (highest bid)
      const highestBid =
        bidUpdates.bids && bidUpdates.bids.length > 0
          ? Math.max(...bidUpdates.bids.map((bid) => bid.amount))
          : listing.currentPrice || listing.startingPrice;

      // Get highest bidder ID from the highest bid
      const highestBidData =
        bidUpdates.bids && bidUpdates.bids.length > 0
          ? bidUpdates.bids.reduce((prev, current) =>
              current.amount > prev.amount ? current : prev,
            )
          : null;

      // Update only the bid-related fields
      setListing((prev) => ({
        ...prev,
        currentPrice: highestBid,
        highestBidder: highestBidData?.bidder || prev.highestBidder,
        totalBids: bidUpdates.bids?.length || prev.totalBids,
        bids: bidUpdates.bids || prev.bids,
        endTime: bidUpdates.endTime || prev.endTime,
      }));

      // Update minimum bid if needed
      const updatedListing = {
        ...listing,
        currentPrice: highestBid,
        bids: bidUpdates.bids || listing.bids,
      };
      const minBid = getMinimumBid(updatedListing);
      const currentBidAmount = parseFloat(bidAmount);
      if (currentBidAmount < minBid) {
        setBidAmount(minBid.toString());
      }
    } catch (error) {
      console.error("Failed to poll bid updates:", error);
      // Fallback to full fetch if the bid endpoint doesn't exist
      try {
        const data = await fetchListingById(listing._id);
        setListing(data);
      } catch (fallbackError) {
        console.error("Fallback fetch also failed:", fallbackError);
      }
    }
  };

  const checkWatchlistStatus = async () => {
    if (!listing || !user) return;

    try {
      const status = await isInWatchlist(listing._id, user._id);
      setInWatchlist(status);
    } catch (error) {
      console.error("Failed to check watchlist:", error);
    }
  };

  const handleToggleWatchlist = async () => {
    if (!user) {
      showToast("Please sign in to save items", "error");
      return;
    }

    if (!listing) return;

    setWatchlistLoading(true);
    try {
      const response = await toggleWatchlist(listing._id, user._id);
      setInWatchlist(response.isInWatchlist || !inWatchlist);
      showToast(
        inWatchlist ? "Removed from watchlist" : "Added to watchlist",
        "success",
      );
    } catch (error) {
      console.error("Failed to toggle watchlist:", error);
      showToast("Failed to update watchlist", "error");
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: listing?.name || "Auction",
          text: `Check out this auction: ${listing?.name}`,
          url: url,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard!", "success");
      setShowShareModal(true);
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
    if (!user) {
      showToast("Please sign in to place a bid", "error");
      return;
    }

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
        bidderId: user._id,
        amount,
      });

      setListing(response.listing);
      setBidSuccess(true);
      showToast("Bid placed successfully!", "success");

      const newMinBid = getMinimumBid(response.listing);
      setBidAmount(newMinBid.toString());

      setTimeout(() => setBidSuccess(false), 5000);

      if (response.extended) {
        showToast(
          `Auction extended! ${
            response.extensionsRemaining || 0
          } extensions remaining.`,
          "info",
        );
      }
    } catch (error: any) {
      console.error("Failed to place bid:", error);
      setBidError(error.message || "Failed to place bid");
      showToast(error.message || "Failed to place bid", "error");
    } finally {
      setBidding(false);
    }
  };

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
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-green-600 text-white"
                : toast.type === "error"
                  ? "bg-red-600 text-white"
                  : "bg-blue-600 text-white"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
            {toast.type === "info" && <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 hover:opacity-80"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-medium text-[#3a3735]">
                Share Auction
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-[#5a524b] hover:text-[#3a3735]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[#5a524b] mb-4">Link copied to clipboard!</p>
            <input
              type="text"
              value={typeof window !== "undefined" ? window.location.href : ""}
              readOnly
              className="w-full px-4 py-2 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] rounded"
            />
          </div>
        </div>
      )}

      {/* Simple Back Button */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#5a524b] hover:text-[#c8a882] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-8">
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
              {category && (
                <div className="text-sm text-[#5a524b] mb-2">
                  {category.name}
                </div>
              )}

              <h1 className="text-3xl font-serif text-[#3a3735] mb-4">
                {listing.name}
              </h1>

              <div className="flex items-center gap-6 mb-6 text-sm text-[#5a524b]">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{listing.totalBids || 0} gebote</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{listing.views || 0} views</span>
                </div>
                {/* <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#c8a882] text-[#c8a882]" />
                  <span>{seller?.rating?.toFixed(1) || "New"}</span>
                </div> */}
              </div>

              <div className="mb-6">
                <div className="text-sm text-[#5a524b] mb-1">
                  {listing.currentPrice ? "Aktuelles Gebot" : "Startgebot"}
                </div>
                <div className="text-4xl font-serif text-[#c8a882]">
                  {(
                    listing.currentPrice || listing.startingPrice
                  )?.toLocaleString("de-CH")}
                  .-
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-[#5a524b]" />
                  <span className="text-sm text-[#5a524b]">
                    {auctionEnded
                      ? "Auktion Beendet"
                      : auctionStarted
                        ? "Verbleibende Zeit"
                        : "Startet In"}
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

              {isHighestBidder && !auctionEnded && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-900">
                      Sie haben das Höchstgebot abgegeben!
                    </div>
                    <div className="text-sm text-green-700">
                      Behalten Sie die Lage im Auge, um immer einen Schritt
                      voraus zu sein.
                    </div>
                  </div>
                </div>
              )}

              {isSeller && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    Sie sind der Verkäufer dieser Auktion.
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="text-sm text-[#5a524b] mb-2">Zustand</div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5f1ea] text-[#3a3735]">
                  <CheckCircle2 className="w-4 h-4 text-[#c8a882]" />
                  <span className="font-medium">
                    {formatCondition(listing.condition)}
                  </span>
                </div>
              </div>

              {!auctionEnded && auctionStarted && !isSeller && (
                <div className="mb-6 p-4 bg-[#f5f1ea]">
                  <div className="text-sm text-[#5a524b] mb-3">
                    Mindestgebot:
                    <span className="font-medium text-[#3a3735]">
                      CHF {minBid.toLocaleString()}
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
                      placeholder={`Enter bid amount (min ${minBid}.-)`}
                    />
                    <button
                      onClick={handlePlaceBid}
                      disabled={bidding || parseFloat(bidAmount) < minBid}
                      className="px-8 py-3 bg-[#3a3735] text-white hover:bg-[#c8a882] hover:text-[#3a3735] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                    >
                      <Gavel className="w-5 h-5" />
                      {bidding ? "Biete..." : "Gebot abgeben"}
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
                      Gebot erfolgreich abgegeben!
                    </div>
                  )}
                </div>
              )}

              {auctionEnded && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200">
                  <div className="font-medium text-red-900 mb-1">
                    Auktion beendet
                  </div>
                  <div className="text-sm text-red-700">
                    {listing.highestBidder
                      ? "Der Gewinner wird vom Verkäufer kontaktiert"
                      : "Es wurden keine Gebote abgegeben."}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={handleToggleWatchlist}
                  disabled={watchlistLoading}
                  className={`py-3 border transition-colors flex items-center justify-center gap-2 ${
                    inWatchlist
                      ? "bg-[#c8a882] border-[#c8a882] text-white"
                      : "border-[#d4cec4] text-[#3a3735] hover:bg-[#f5f1ea]"
                  } disabled:opacity-50`}
                >
                  <Heart
                    className={`w-4 h-4 ${inWatchlist ? "fill-white" : ""}`}
                  />
                  <span>{inWatchlist ? "Gespeichert" : "Speichern"}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="py-3 border border-[#d4cec4] text-[#3a3735] hover:bg-[#f5f1ea] transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Teilen</span>
                </button>
              </div>

              <div className="space-y-3 pt-6 border-t border-[#d4cec4]">
                <div className="flex items-center gap-3 text-sm text-[#5a524b]">
                  <Truck className="w-5 h-5 text-[#c8a882]" />
                  <span>Versand nach Auktionsende möglich</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#5a524b]">
                  <Shield className="w-5 h-5 text-[#c8a882]" />
                  <span>Echtheit garantiert</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#5a524b]">
                  <Package className="w-5 h-5 text-[#c8a882]" />
                  <span>Sichere Verpackung und Handhabung</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 mb-6">
              <h2 className="text-2xl font-serif text-[#3a3735] mb-4">
                Beschreibung
              </h2>
              <div className="text-[#5a524b] leading-relaxed whitespace-pre-line">
                {listing.description}
              </div>
            </div>

            <div className="bg-white p-6">
              <h2 className="text-2xl font-serif text-[#3a3735] mb-4">
                Gebotsverlauf ({bidHistory.length})
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
                  <p>Noch keine Gebote. Gib als Erster ein Gebot ab.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6">
              <h3 className="text-lg font-medium text-[#3a3735] mb-4">
                Auktionsdetails
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#5a524b]">Startgebot:</span>
                  <span className="text-[#3a3735] font-medium">
                    ${listing.startingPrice?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5a524b]">Gebotserhöhung:</span>
                  <span className="text-[#3a3735] font-medium">
                    ${listing.bidIncrement?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5a524b]">Zustand:</span>
                  <span className="text-[#3a3735] font-medium">
                    {formatCondition(listing.condition)}
                  </span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="text-[#5a524b]">Zustand:</span>
                  <span className="text-[#3a3735] font-medium capitalize">
                    {listing.status}
                  </span>
                </div> */}
                {/* <div className="flex justify-between">
                  <span className="text-[#5a524b]">Started:</span>
                  <span className="text-[#3a3735] font-medium">
                    {listing.startTime
                      ? new Date(listing.startTime).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div> */}
                <div className="flex justify-between">
                  <span className="text-[#5a524b]">Ende:</span>
                  <span className="text-[#3a3735] font-medium">
                    {listing.endTime
                      ? new Date(listing.endTime).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
