"use client";

import { useState, useEffect } from "react";
import { Star, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  IListing,
  IPaginatedResponse,
  ListingStatus,
  ListingTypes,
} from "../lib/types/user.types";
import { ListingCard } from "./search/listing-card";
import { fetchBoostedListings } from "@/services/listings";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// If you have an enum for BoostTypes, import it. Otherwise, we use the string literal.
const BOOST_TYPE_HOMEPAGE = "HOMEPAGE";

export default function ListingsComponent() {
  // --- Logic State ---
  const [listings, setListings] = useState<IListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
  });

  useEffect(() => {
    fetchListings();
  }, [page, filters]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchBoostedListings("HOMEPAGE");

      setListings(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#faf8f4] py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-[#c8a882]" fill="#c8a882" />
              <span className="text-[#c8a882] text-xs font-bold tracking-[0.2em] uppercase">
                Curated Collection
              </span>
            </div>
            <h1
              className="text-[#3a3735] text-4xl md:text-5xl font-medium"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Exclusive Finds
            </h1>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r">
            <p className="text-red-700 font-serif">{error}</p>
            <button
              onClick={fetchListings}
              className="text-red-700 text-sm underline mt-2"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && listings.length === 0 && (
          <div className="flex flex-col justify-center items-center py-32">
            <Loader2 className="h-10 w-10 text-[#c8a882] animate-spin mb-4" />
            <p className="text-[#9a928c] font-serif italic">
              Curating selection...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && listings.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-32 border border-dashed border-[#d4cec4] rounded-lg bg-white/50">
            <p className="text-[#3a3735] text-xl font-serif mb-2">
              No items available
            </p>
            <p className="text-[#9a928c]">
              Check back later for new exclusive additions.
            </p>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && listings.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard
                  key={listing._id}
                  listing={listing}
                  // Pass watchlist state if available in parent
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-20">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="group flex items-center justify-center w-12 h-12 border border-[#d4cec4] rounded-full text-[#3a3735] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#3a3735] hover:text-white hover:border-[#3a3735] transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-[#3a3735] font-serif text-lg tracking-wide">
                  Page <span className="font-semibold">{page}</span> of{" "}
                  {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="group flex items-center justify-center w-12 h-12 border border-[#d4cec4] rounded-full text-[#3a3735] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#3a3735] hover:text-white hover:border-[#3a3735] transition-all duration-300"
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
