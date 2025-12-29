"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  Star,
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
// Assuming types are available as per your original code
import {
  IListing,
  IPaginatedResponse,
  ListingStatus,
  ListingTypes,
} from "../lib/types/user.types";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ListingsComponent() {
  // --- Logic State ---
  const router = useRouter();

  const [listings, setListings] = useState<IListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    category: "",
    search: "",
  });

  // --- Effects ---
  useEffect(() => {
    fetchListings();
  }, [page, filters]);

  // --- API Handlers ---
  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(filters.status && { status: filters.status }),
        ...(filters.type && { type: filters.type }),
        ...(filters.category && { category: filters.category }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(`${API_URL}/listing?${queryParams}`);

      if (!response.ok) throw new Error("Failed to fetch listings");

      const data: IPaginatedResponse<IListing> = await response.json();

      if (data) {
        setListings(data.data || data); // Adjust based on your actual API shape (sometimes data.data contains the array)
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
        }
      } else {
        throw new Error("Failed to load listings");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching listings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  // --- Helpers ---
  const formatPrice = (price?: number) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("de-CH", {
      style: "currency",
      currency: "CHF",
    }).format(price);
  };

  const getListingImage = (listing: IListing) => {
    // Fallback logic for images
    const mainImage = listing.images?.find((img) => img.type === "main");
    return (
      mainImage?.url || listing.images?.[0]?.url || "/placeholder-image.jpg"
    );
  };

  const getRemainingTime = (endTime?: Date) => {
    if (!endTime) return null;
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  // --- Segmentation (Hero vs Grid) ---
  const heroListing = listings.length > 0 ? listings[0] : null;
  const gridListings = listings.length > 1 ? listings.slice(1) : [];

  // --- Render ---
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#faf8f4] to-[#f5f1ea] py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <Star
              className="w-5 h-5 text-[#c8a882]"
              strokeWidth={1.5}
              fill="#c8a882"
            />
            <span className="text-[#c8a882] text-sm tracking-[0.2em] uppercase font-medium">
              Curated Collection
            </span>
          </div>
          <h1
            className="text-[#3a3735] text-4xl md:text-5xl font-medium"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Exclusive Listings
          </h1>
        </div>

        {/* Luxury Filters Bar */}
        <div className="mb-16 bg-white p-4 shadow-sm border border-[#e8dfd0]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c8a882]" />
              <input
                type="text"
                placeholder="Search collection..."
                className="w-full pl-10 pr-4 py-3 bg-[#faf8f4] border-none focus:ring-1 focus:ring-[#c8a882] text-[#3a3735] placeholder-[#9a928c] text-sm transition-all"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            {/* Status Select */}
            <div className="relative">
              <select
                className="w-full px-4 py-3 bg-[#faf8f4] border-none focus:ring-1 focus:ring-[#c8a882] text-[#3a3735] text-sm appearance-none cursor-pointer"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value={ListingStatus.ACTIVE}>Active</option>
                <option value={ListingStatus.PENDING}>Pending</option>
                <option value={ListingStatus.SOLD}>Sold</option>
                <option value={ListingStatus.EXPIRED}>Expired</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c8a882] pointer-events-none" />
            </div>

            {/* Type Select */}
            <div className="relative">
              <select
                className="w-full px-4 py-3 bg-[#faf8f4] border-none focus:ring-1 focus:ring-[#c8a882] text-[#3a3735] text-sm appearance-none cursor-pointer"
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="">All Types</option>
                <option value={ListingTypes.AUCTION}>Auction</option>
                <option value={ListingTypes.DIRECT_BUY}>Direct Buy</option>
                <option value={ListingTypes.BOTH}>Both</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c8a882] rotate-90 pointer-events-none" />
            </div>

            {/* Reset Button */}
            <button
              onClick={() =>
                setFilters({ status: "", type: "", category: "", search: "" })
              }
              className="px-6 py-3 bg-[#3a3735] text-[#faf8f4] text-sm hover:bg-[#c8a882] hover:text-white transition-colors duration-300 tracking-wide uppercase"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <p className="text-red-700 font-serif">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && listings.length === 0 && (
          <div className="flex flex-col justify-center items-center py-32">
            <Loader2 className="h-12 w-12 text-[#c8a882] animate-spin mb-4" />
            <p className="text-[#3a3735] font-serif italic">
              Loading exclusive items...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && listings.length === 0 && !error && (
          <div className="text-center py-24 border border-dashed border-[#c8a882] bg-white/50">
            <p className="text-[#3a3735] text-xl font-serif mb-2">
              No listings found
            </p>
            <p className="text-[#5a524b]">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Content */}
        {!loading && listings.length > 0 && (
          <>
            {/* GRID ITEMS (Remaining Listings) */}
            {gridListings.length > 0 && (
              <div className="mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                  {gridListings.map((listing) => (
                    <div
                      key={listing._id}
                      onClick={() => router.push(`/listing/${listing._id}`)}
                      className="group bg-white shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden flex flex-col"
                    >
                      {/* Grid Image */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#e8dfd0]">
                        <img
                          src={getListingImage(listing)}
                          alt={listing.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-3 left-3 bg-[#faf8f4]/90 backdrop-blur-md text-[#3a3735] px-3 py-1 text-[10px] tracking-wider uppercase flex items-center gap-1 font-semibold">
                          {listing.status}
                        </div>
                        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-[#c8a882] hover:text-white transition-colors">
                          <Heart className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>

                      {/* Grid Details */}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex-1">
                          <h4
                            className="text-[#3a3735] mb-2 group-hover:text-[#c8a882] transition-colors line-clamp-2 leading-snug"
                            style={{
                              fontFamily: "Playfair Display, serif",
                              fontSize: "1.25rem",
                            }}
                          >
                            {listing.name}
                          </h4>
                          <p className="text-[#9a928c] text-xs mb-4 line-clamp-2 leading-relaxed">
                            {listing.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-[#f0ebe5]">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[#c8a882] text-[10px] uppercase tracking-wider mb-1">
                                {listing.type === ListingTypes.DIRECT_BUY
                                  ? "Buy Now"
                                  : "Current Bid"}
                              </p>
                              <p className="text-[#3a3735] text-lg font-medium font-serif">
                                {formatPrice(
                                  listing.currentPrice || listing.buyNowPrice
                                )}
                              </p>
                            </div>
                            {listing.endTime && (
                              <div className="flex items-center gap-1 text-[#9a928c]">
                                <Clock className="w-3 h-3" strokeWidth={1.5} />
                                <span className="text-xs">
                                  {getRemainingTime(listing.endTime)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-20">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-12 h-12 flex items-center justify-center border border-[#d4cec4] text-[#3a3735] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#3a3735] hover:text-white hover:border-[#3a3735] transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-[#3a3735] font-serif italic text-lg px-4">
                  Page {page} <span className="text-[#c8a882] mx-1">/</span>{" "}
                  {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-12 h-12 flex items-center justify-center border border-[#d4cec4] text-[#3a3735] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#3a3735] hover:text-white hover:border-[#3a3735] transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
