"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid,
  List,
  Heart,
  Clock,
  TrendingUp,
  Eye,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import _ from "lodash";
import { getListingUrl } from "@/services/listings";

// Types
interface Listing {
  _id: string;
  name: string;
  description: string;
  currentPrice: number;
  buyNowPrice?: number;
  startingPrice?: number;
  condition: string;
  images: { url: string; alt?: string }[];
  status: string;
  totalBids: number;
  views: number;
  type: string;
  isBoosted: boolean;
  endTime?: string;
  category: { _id: string; name: string; slug: string };
  seller: { _id: string; username: string };
}

interface SearchResponse {
  success: boolean;
  data: Listing[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const conditions = [
  { value: "NEW", label: "New" },
  { value: "LIKE_NEW", label: "Like New" },
  { value: "VERY_GOOD", label: "Very Good" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
];

const sortOptions = [
  { value: "relevance", label: "Most Relevant" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "ending_soon", label: "Ending Soon" },
  { value: "newest", label: "Newly Listed" },
  { value: "most_bids", label: "Most Bids" },
  { value: "most_viewed", label: "Most Viewed" },
];

const categories = [
  "Watches & Timepieces",
  "Fine Art",
  "Electronics",
  "Jewelry & Gems",
  "Furniture & Design",
  "Wine & Spirits",
  "Collectibles",
  "Musical Instruments",
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 24,
    pages: 0,
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    searchParams.get("condition")?.split(",").filter(Boolean) || []
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "relevance"
  );
  const [listingType, setListingType] = useState(
    searchParams.get("type") || ""
  );

  // Fetch listings function
  const fetchListings = useCallback(async (params: URLSearchParams) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/search?${params.toString()}`
      );
      const data: SearchResponse = await response.json();

      if (data.success) {
        setListings(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Build query params
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedConditions.length > 0)
      params.set("condition", selectedConditions.join(","));
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sortBy && sortBy !== "relevance") params.set("sortBy", sortBy);
    if (listingType) params.set("type", listingType);
    params.set("page", pagination.page.toString());
    params.set("limit", pagination.limit.toString());

    return params;
  }, [
    searchQuery,
    selectedCategory,
    selectedConditions,
    minPrice,
    maxPrice,
    sortBy,
    listingType,
    pagination.page,
    pagination.limit,
  ]);

  // Debounced fetch with lodash
  const debouncedFetch = useMemo(
    () =>
      _.debounce((params: URLSearchParams) => {
        fetchListings(params);
      }, 500),
    [fetchListings]
  );

  // Update URL and trigger search
  useEffect(() => {
    const params = buildQueryParams();
    router.push(`/search?${params.toString()}`, { scroll: false });
    debouncedFetch(params);

    return () => {
      debouncedFetch.cancel();
    };
  }, [
    searchQuery,
    selectedCategory,
    selectedConditions,
    minPrice,
    maxPrice,
    sortBy,
    listingType,
    pagination.page,
    buildQueryParams,
    debouncedFetch,
    router,
  ]);

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedConditions([]);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("relevance");
    setListingType("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Toggle condition
  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Format time remaining
  const getTimeRemaining = (endTime?: string) => {
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

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    selectedConditions.length +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (listingType ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      {/* Search Header */}
      <div className="bg-white border-b border-[#d4cec4] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5a524b]"
                strokeWidth={1.5}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                placeholder="Search for luxury items..."
                className="w-full pl-12 pr-4 py-3 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] placeholder:text-[#5a524b]/60 focus:outline-none focus:border-[#c8a882] focus:bg-white transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full md:w-64">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="w-full px-4 py-3 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] focus:outline-none focus:border-[#c8a882] focus:bg-white transition-all appearance-none cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a524b] pointer-events-none"
                strokeWidth={1.5}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-[#3a3735] hover:bg-[#c8a882] text-white hover:text-[#3a3735] transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-[#c8a882] text-[#3a3735] px-2 py-0.5 rounded-full text-xs">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* View Toggle */}
            <div className="flex gap-1 bg-[#f5f1ea] p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid" ? "bg-white shadow-sm" : ""
                }`}
              >
                <Grid className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list" ? "bg-white shadow-sm" : ""
                }`}
              >
                <List className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div
            className={`${showFilters ? "block" : "hidden"} w-64 flex-shrink-0`}
          >
            <div className="bg-white p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#3a3735] font-semibold">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-[#c8a882] text-sm hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-[#3a3735] text-sm font-medium mb-3">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="w-full px-3 py-2 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] text-sm focus:outline-none focus:border-[#c8a882]"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-[#3a3735] text-sm font-medium mb-3">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    placeholder="Min"
                    className="w-full px-3 py-2 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] text-sm focus:outline-none focus:border-[#c8a882]"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    placeholder="Max"
                    className="w-full px-3 py-2 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] text-sm focus:outline-none focus:border-[#c8a882]"
                  />
                </div>
              </div>

              {/* Condition Filter */}
              <div className="mb-6">
                <label className="block text-[#3a3735] text-sm font-medium mb-3">
                  Condition
                </label>
                <div className="space-y-2">
                  {conditions.map((cond) => (
                    <label
                      key={cond.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(cond.value)}
                        onChange={() => toggleCondition(cond.value)}
                        className="w-4 h-4 accent-[#c8a882]"
                      />
                      <span className="text-[#3a3735] text-sm">
                        {cond.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Listing Type */}
              <div className="mb-6">
                <label className="block text-[#3a3735] text-sm font-medium mb-3">
                  Listing Type
                </label>
                <select
                  value={listingType}
                  onChange={(e) => {
                    setListingType(e.target.value);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="w-full px-3 py-2 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] text-sm focus:outline-none focus:border-[#c8a882]"
                >
                  <option value="">All Types</option>
                  <option value="AUCTION">Auction</option>
                  <option value="DIRECT_BUY">Buy Now</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#5a524b]">
                {loading
                  ? "Loading..."
                  : `${pagination.total.toLocaleString()} results found`}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#c8a882]" />
              </div>
            )}

            {/* Grid View */}
            {!loading && viewMode === "grid" && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {listings.map((listing) => {
                  const isAuction = listing.type === "AUCTION";
                  const displayPrice = isAuction
                    ? listing.currentPrice
                    : listing.buyNowPrice;
                  const priceLabel = isAuction ? "Current Bid" : "Buy Now";
                  const listingUrl = getListingUrl(listing);

                  return (
                    <Link
                      key={listing._id}
                      href={listingUrl}
                      className="group bg-white hover:bg-[#f5f1ea] cursor-pointer transition-all shadow-sm hover:shadow-lg"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[#e8dfd0]">
                        {listing.isBoosted && (
                          <div className="absolute top-2 left-2 bg-[#c8a882] text-white px-2 py-1 text-xs z-10">
                            FEATURED
                          </div>
                        )}
                        <img
                          src={listing.images[0]?.url || "/placeholder.jpg"}
                          alt={listing.name}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-[#c8a882] hover:text-white transition-colors"
                        >
                          <Heart className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                      <div className="p-3">
                        <h4 className="text-[#3a3735] mb-2 text-sm line-clamp-2 group-hover:text-[#c8a882] transition-colors font-serif">
                          {listing.name}
                        </h4>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <div className="flex flex-col">
                            <span className="text-[#5a524b]/60 text-[10px]">
                              {priceLabel}
                            </span>
                            <span className="text-[#c8a882] font-medium">
                              ${displayPrice?.toLocaleString()}
                            </span>
                          </div>
                          {isAuction && listing.endTime && (
                            <div className="flex items-center gap-1 text-[#5a524b]">
                              <Clock className="w-3 h-3" strokeWidth={1.5} />
                              <span>{getTimeRemaining(listing.endTime)}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#5a524b]">
                          {isAuction && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>{listing.totalBids}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{listing.views}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* List View */}
            {!loading && viewMode === "list" && (
              <div className="space-y-4">
                {listings.map((listing) => {
                  const isAuction = listing.type === "AUCTION";
                  const displayPrice = isAuction
                    ? listing.currentPrice
                    : listing.buyNowPrice;
                  const priceLabel = isAuction ? "Current Bid" : "Buy Now";
                  const listingUrl = getListingUrl(listing);

                  return (
                    <Link
                      key={listing._id}
                      href={listingUrl}
                      className="group bg-white hover:bg-[#f5f1ea] cursor-pointer transition-all shadow-sm hover:shadow-lg p-4 flex gap-4"
                    >
                      <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden bg-[#e8dfd0]">
                        {listing.isBoosted && (
                          <div className="absolute top-2 left-2 bg-[#c8a882] text-white px-2 py-1 text-xs z-10">
                            FEATURED
                          </div>
                        )}
                        <img
                          src={listing.images[0]?.url || "/placeholder.jpg"}
                          alt={listing.name}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[#3a3735] text-lg mb-2 group-hover:text-[#c8a882] transition-colors font-serif">
                          {listing.name}
                        </h4>
                        <p className="text-[#5a524b] text-sm mb-3 line-clamp-2">
                          {listing.description}
                        </p>
                        <div className="flex items-center gap-6 text-sm mb-3">
                          <div className="flex flex-col">
                            <span className="text-[#5a524b]/60 text-xs">
                              {priceLabel}
                            </span>
                            <span className="text-[#c8a882] font-medium text-lg">
                              ${displayPrice?.toLocaleString()}
                            </span>
                          </div>
                          <span className="text-[#5a524b]">
                            Condition: {listing.condition.replace(/_/g, " ")}
                          </span>
                          {isAuction && listing.endTime && (
                            <div className="flex items-center gap-1 text-[#5a524b]">
                              <Clock className="w-4 h-4" strokeWidth={1.5} />
                              <span>{getTimeRemaining(listing.endTime)}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-[#5a524b]">
                          {isAuction && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              <span>{listing.totalBids} bids</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{listing.views} views</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {!loading && listings.length === 0 && (
              <div className="text-center py-20">
                <Search
                  className="w-16 h-16 text-[#d4cec4] mx-auto mb-4"
                  strokeWidth={1}
                />
                <h3 className="text-[#3a3735] text-xl mb-2">
                  No results found
                </h3>
                <p className="text-[#5a524b] mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-[#3a3735] hover:bg-[#c8a882] text-white hover:text-[#3a3735] transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-white border border-[#d4cec4] text-[#3a3735] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f5f1ea] transition-colors"
                >
                  Previous
                </button>
                {Array.from(
                  { length: Math.min(5, pagination.pages) },
                  (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() =>
                          setPagination((prev) => ({ ...prev, page }))
                        }
                        className={`px-4 py-2 ${
                          pagination.page === page
                            ? "bg-[#c8a882] text-white"
                            : "bg-white border border-[#d4cec4] text-[#3a3735] hover:bg-[#f5f1ea]"
                        } transition-colors`}
                      >
                        {page}
                      </button>
                    );
                  }
                )}
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.min(prev.pages, prev.page + 1),
                    }))
                  }
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 bg-white border border-[#d4cec4] text-[#3a3735] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f5f1ea] transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
