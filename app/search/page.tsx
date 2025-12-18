"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import _ from "lodash";
import { ListingCard } from "@/components/search/listing-card";
import { SearchFilters } from "@/components/search/search-filters";

// Types (Keep these or move to a separate types file)
interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Listing {
  _id: string;
  name: string;
  currentPrice: number;
  buyNowPrice?: number;
  images: { url: string }[];
  status: string;
  totalBids: number;
  views: number;
  type: string;
  isBoosted: boolean;
  endTime?: string;
  category: Category;
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

const SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "ending_soon", label: "Ending Soon" },
  { value: "newest", label: "Newly Listed" },
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- STATE ---
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 24,
    pages: 0,
  });

  // Filter State
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState(
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

  // --- API CALLS ---

  // 1. Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/category`
        );
        const data = await response.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // 2. Fetch Listings
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

  // 3. Debounced Search Logic
  const debouncedFetch = useMemo(
    () => _.debounce((params: URLSearchParams) => fetchListings(params), 300),
    [fetchListings]
  );

  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedCategoryId) params.set("category", selectedCategoryId);
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
    selectedCategoryId,
    selectedConditions,
    minPrice,
    maxPrice,
    sortBy,
    listingType,
    pagination.page,
    pagination.limit,
  ]);

  useEffect(() => {
    const params = buildQueryParams();
    router.push(`/search?${params.toString()}`, { scroll: false });
    debouncedFetch(params);
    return () => debouncedFetch.cancel();
  }, [
    searchQuery,
    selectedCategoryId,
    selectedConditions,
    minPrice,
    maxPrice,
    sortBy,
    listingType,
    pagination.page,
  ]);

  // --- HANDLERS ---

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategoryId("");
    setSelectedConditions([]);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("relevance");
    setListingType("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Helper to update filters from child component
  const handleFilterChange = (key: string, value: any) => {
    setPagination((prev) => ({ ...prev, page: 1 })); // Always reset to page 1 on filter change
    switch (key) {
      case "category":
        setSelectedCategoryId(value);
        break;
      case "minPrice":
        setMinPrice(value);
        break;
      case "maxPrice":
        setMaxPrice(value);
        break;
      case "condition":
        setSelectedConditions(value);
        break;
      case "type":
        setListingType(value);
        break;
    }
  };

  const activeFiltersCount =
    (selectedCategoryId ? 1 : 0) +
    selectedConditions.length +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (listingType ? 1 : 0);

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#faf8f4]">
      {/* 1. Header Bar */}
      <div className="bg-white border-b border-[#d4cec4] sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-4">
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
              className="w-full pl-12 pr-4 py-3 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] placeholder:text-[#5a524b]/60 focus:outline-none focus:border-[#c8a882] focus:bg-white transition-all rounded-sm"
            />
          </div>

          <div className="relative w-64 hidden sm:block">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full px-4 py-3 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] focus:outline-none focus:border-[#c8a882] focus:bg-white transition-all appearance-none cursor-pointer rounded-sm"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a524b] pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* 2. Sidebar Component */}
          <SearchFilters
            categories={categories}
            filters={{
              category: selectedCategoryId,
              minPrice,
              maxPrice,
              conditions: selectedConditions,
              type: listingType,
            }}
            setFilters={handleFilterChange}
            resetFilters={resetFilters}
            activeCount={activeFiltersCount}
          />

          {/* 3. Results Area */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#5a524b] text-lg font-serif italic">
                {loading
                  ? "Searching..."
                  : `${pagination.total.toLocaleString()} ${
                      pagination.total === 1 ? "result" : "results"
                    }`}
              </p>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#c8a882]" />
              </div>
            )}

            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {listings.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>
            )}

            {!loading && listings.length === 0 && (
              <div className="text-center py-20">
                <Search
                  className="w-16 h-16 text-[#d4cec4] mx-auto mb-4"
                  strokeWidth={1}
                />
                <h3 className="text-[#3a3735] text-xl mb-2 font-serif">
                  No results found
                </h3>
                <p className="text-[#5a524b] mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-[#3a3735] hover:bg-[#c8a882] text-white hover:text-[#3a3735] transition-all uppercase tracking-wider text-xs font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-white border border-[#d4cec4] text-[#3a3735] disabled:opacity-50 hover:bg-[#f5f1ea] transition-colors rounded-sm text-sm"
                >
                  Previous
                </button>
                <span className="text-[#5a524b] text-sm px-2">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.min(prev.pages, prev.page + 1),
                    }))
                  }
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 bg-white border border-[#d4cec4] text-[#3a3735] disabled:opacity-50 hover:bg-[#f5f1ea] transition-colors rounded-sm text-sm"
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
