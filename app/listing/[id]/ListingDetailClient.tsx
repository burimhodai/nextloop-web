"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Heart,
  Share2,
  Shield,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  Package,
  CreditCard,
  ArrowLeft,
  X,
  AlertCircle,
  User, // Added User icon for fallback
} from "lucide-react";
import { IListing } from "@/lib/types/listing.types";
import {
  getMainImage,
  formatCondition,
  createCheckoutSession,
  toggleWatchlist,
  isInWatchlist,
  incrementListingView,
  fetchListingStatus,
} from "@/services/listings";
import { useAuthStore } from "@/lib/stores/authStore";

interface ListingDetailClientProps {
  initialListing: IListing;
}

export default function ListingDetailClient({
  initialListing,
}: ListingDetailClientProps) {
  const router = useRouter();
  const [listing] = useState<IListing>(initialListing);

  const [activeImage, setActiveImage] = useState<string>(
    getMainImage(initialListing),
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { user } = useAuthStore();
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

  // View tracking
  const viewTrackedRef = useRef(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Poll for listing status every 10 seconds
  useEffect(() => {
    // Only poll if listing is ACTIVE
    if (listing.status !== "ACTIVE") {
      return;
    }

    pollingIntervalRef.current = setInterval(() => {
      checkListingStatus();
    }, 10000); // Check every 10 seconds

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [listing._id, listing.status]);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    setToast({ message, type });
  };

  const incrementView = async () => {
    try {
      await incrementListingView(listing._id);
    } catch (error) {
      console.error("Failed to increment view:", error);
    }
  };

  const checkListingStatus = async () => {
    try {
      const statusData = await fetchListingStatus(listing._id);

      // If listing has been sold, redirect to home
      if (statusData.status === "SOLD") {
        showToast("This item has been sold", "info");

        // Wait 2 seconds before redirecting so user can see the message
        setTimeout(() => {
          router.push("/");
        }, 2000);

        // Clear the polling interval
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      }
    } catch (error) {
      console.error("Failed to check listing status:", error);
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
          title: listing?.name || "Listing",
          text: `Check out this item: ${listing?.name}`,
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

  const handleBuyNow = async () => {
    if (!user) {
      showToast("Please sign in to make a purchase", "error");
      return;
    }

    try {
      const response = await createCheckoutSession({
        listingId: listing._id,
        userId: user._id,
      });

      // Redirects to Stripe checkout
      window.location.href = response.data.url;
    } catch (error: any) {
      console.error("Checkout failed:", error);
      showToast(error.message || "Failed to start checkout", "error");
    }
  };

  const seller: any =
    typeof listing.seller === "object" ? listing.seller : null;
  const category =
    typeof listing.category === "object" ? listing.category : null;
  console.log({ listing, seller });

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
                Share Listing
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-[#5a524b] hover:text-[#3a3735]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[#5a524b] mb-4">
              Link in die Zwischenablage kopiert!
            </p>
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
                <Image
                  src={activeImage}
                  alt={listing.name || "Product image"}
                  fill
                  className="object-cover"
                  priority
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
                    <Image
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

          {/* Product Details */}
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
                  <Eye className="w-4 h-4" />
                  <span>{listing.views || 0} Ansichten</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#c8a882] text-[#c8a882]" />
                  <span>{seller?.rating?.toFixed(1) || "Neu"}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm text-[#5a524b] mb-1">
                  Jetzt kaufen Preis
                </div>
                <div className="text-4xl font-serif text-[#c8a882]">
                  {listing.buyNowPrice?.toLocaleString("de-CH")}.-
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm text-[#5a524b] mb-2">Zustand</div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5f1ea] text-[#3a3735]">
                  <CheckCircle2 className="w-4 h-4 text-[#c8a882]" />
                  <span className="font-medium">
                    {formatCondition(listing.condition)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 bg-[#3a3735] text-white hover:bg-[#c8a882] hover:text-[#3a3735] transition-all flex items-center justify-center gap-2 text-lg font-medium"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Jetzt kaufen</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
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
              </div>

              <div className="space-y-3 pt-6 border-t border-[#d4cec4]">
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

        {/* Description & Details & SELLER */}
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

            {listing.shippingOptions && listing.shippingOptions.length > 0 && (
              <div className="bg-white p-6">
                <h2 className="text-2xl font-serif text-[#3a3735] mb-4">
                  Versandoptionen
                </h2>
                <div className="space-y-3">
                  {listing.shippingOptions.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-[#d4cec4] last:border-0"
                    >
                      <div>
                        <div className="font-medium text-[#3a3735]">
                          {option.method}
                        </div>
                        {option.estimatedDays && (
                          <div className="text-sm text-[#5a524b]">
                            Geschätzte Lieferung: {option.estimatedDays} Tage
                          </div>
                        )}
                      </div>
                      <div className="font-medium text-[#3a3735]">
                        ${option.cost.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Info Sidebar */}
          <div className="space-y-6">
            {/* --- SELLER SECTION START --- */}
            {seller && (
              <div className="bg-white p-6">
                <h3 className="text-lg font-medium text-[#3a3735] mb-4">
                  Verkäufer
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#f5f1ea] flex items-center justify-center border border-[#d4cec4]">
                    {seller.image ? (
                      <Image
                        src={seller.image}
                        alt={seller.name || "Verkäufer"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-[#c8a882]" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-[#3a3735]">
                      {seller.name || "Unbekannt"}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-[#5a524b]">
                      <Star className="w-3 h-3 fill-[#c8a882] text-[#c8a882]" />
                      <span>
                        {seller.rating ? seller.rating.toFixed(1) : "Neu"}
                      </span>
                      {seller.reviewCount !== undefined && (
                        <>
                          <span className="mx-1">•</span>
                          <span>{seller.reviewCount} Bewertungen</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {seller.createdAt && (
                  <div className="text-sm text-[#5a524b] pt-4 border-t border-[#d4cec4]">
                    Mitglied seit {new Date(seller.createdAt).getFullYear()}
                  </div>
                )}
              </div>
            )}
            {/* --- SELLER SECTION END --- */}

            <div className="bg-white p-6">
              <h3 className="text-lg font-medium text-[#3a3735] mb-4">
                Artikeldetails
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#5a524b]">Zustand :</span>
                  <span className="text-[#3a3735] font-medium">
                    {formatCondition(listing.condition)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5a524b]"> Inseriert seit :</span>
                  <span className="text-[#3a3735] font-medium">
                    {listing.createdAt
                      ? new Date(listing.createdAt).toLocaleDateString()
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
