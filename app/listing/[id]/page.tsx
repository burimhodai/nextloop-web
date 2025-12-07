"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Heart,
  Share2,
  Flag,
  MapPin,
  Truck,
  Shield,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  Package,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import { IListing, ImageTypes } from "@/lib/types/listing.types";
import {
  fetchListingById,
  getMainImage,
  formatCondition,
} from "@/services/listings";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<IListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const data = await fetchListingById(params.id as string);

      // If it's an auction, redirect to auction page
      if (data.type === "AUCTION") {
        router.push(`/auction/${params.id}`);
        return;
      }

      setListing(data);
      const mainImageUrl = getMainImage(data);
      setActiveImage(mainImageUrl);
    } catch (error) {
      console.error("Failed to fetch listing:", error);
      setError("Failed to load listing details.");
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

  const handleBuyNow = () => {
    // TODO: Implement checkout
    console.log("Buy now:", listing?._id, "quantity:", quantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c8a882] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#5a524b]">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-[#3a3735] mb-4">Listing Not Found</h2>
          <p className="text-[#5a524b] mb-6">
            {error || "This listing does not exist."}
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
                <Image
                  src={activeImage}
                  alt={listing.name || "Product image"}
                  fill
                  className="object-cover"
                  priority
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
                  <Eye className="w-4 h-4" />
                  <span>{listing.views || 0} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#c8a882] text-[#c8a882]" />
                  <span>{seller?.rating?.toFixed(1) || "New"}</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-sm text-[#5a524b] mb-1">Buy Now Price</div>
                <div className="text-4xl font-serif text-[#c8a882]">
                  ${listing.buyNowPrice?.toLocaleString()}
                </div>
              </div>

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

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm text-[#5a524b] mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-[#f5f1ea] hover:bg-[#d4cec4] flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-20 h-10 text-center bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] focus:outline-none focus:border-[#c8a882]"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-[#f5f1ea] hover:bg-[#d4cec4] flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 bg-[#3a3735] text-white hover:bg-[#c8a882] hover:text-[#3a3735] transition-all flex items-center justify-center gap-2 text-lg font-medium"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Buy Now</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3 border border-[#d4cec4] text-[#3a3735] hover:bg-[#f5f1ea] transition-colors flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button className="py-3 border border-[#d4cec4] text-[#3a3735] hover:bg-[#f5f1ea] transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 pt-6 border-t border-[#d4cec4]">
                <div className="flex items-center gap-3 text-sm text-[#5a524b]">
                  <Truck className="w-5 h-5 text-[#c8a882]" />
                  <span>Free shipping on orders over $500</span>
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

            {/* Seller Info */}
            {seller && (
              <div className="bg-white p-6">
                <h3 className="text-lg font-medium text-[#3a3735] mb-4">
                  Seller Information
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#c8a882] rounded-full flex items-center justify-center text-white font-medium">
                    {seller.username?.[0]?.toUpperCase() || "S"}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-[#3a3735] mb-1">
                      {seller.username}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#5a524b] mb-3">
                      <Star className="w-4 h-4 fill-[#c8a882] text-[#c8a882]" />
                      <span>{seller.rating?.toFixed(1) || "New Seller"}</span>
                      <span>({seller.totalRatings || 0} reviews)</span>
                    </div>
                    <button className="px-4 py-2 border border-[#d4cec4] text-[#3a3735] hover:bg-[#f5f1ea] transition-colors text-sm">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description & Details */}
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

            {/* Shipping Options */}
            {listing.shippingOptions && listing.shippingOptions.length > 0 && (
              <div className="bg-white p-6">
                <h2 className="text-2xl font-serif text-[#3a3735] mb-4">
                  Shipping Options
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
                            Estimated delivery: {option.estimatedDays} days
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
            <div className="bg-white p-6">
              <h3 className="text-lg font-medium text-[#3a3735] mb-4">
                Item Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#5a524b]">Status:</span>
                  <span className="text-[#3a3735] font-medium capitalize">
                    {listing.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5a524b]">Condition:</span>
                  <span className="text-[#3a3735] font-medium">
                    {formatCondition(listing.condition)}
                  </span>
                </div>
                {listing.shippingCost && (
                  <div className="flex justify-between">
                    <span className="text-[#5a524b]">Base Shipping:</span>
                    <span className="text-[#3a3735] font-medium">
                      ${listing.shippingCost.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#5a524b]">Listed:</span>
                  <span className="text-[#3a3735] font-medium">
                    {listing.createdAt
                      ? new Date(listing.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6">
              <button className="w-full py-3 border border-[#d4cec4] text-[#3a3735] hover:bg-[#f5f1ea] transition-colors flex items-center justify-center gap-2">
                <Flag className="w-4 h-4" />
                <span>Report this listing</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
