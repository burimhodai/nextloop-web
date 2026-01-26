// app/(dashboard)/dashboard/listings/page.tsx
"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Loader2,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  ExternalLink,
} from "lucide-react";

type ListingStatus = "ACTIVE" | "SOLD" | "EXPIRED" | "DRAFT" | "PAUSED";
type ListingType = "AUCTION" | "BUY_NOW";

interface Listing {
  _id: string;
  name: string;
  description: string;
  type: ListingType;
  status: ListingStatus;
  images: { url: string }[];
  currentPrice?: number;
  buyNowPrice?: number;
  startingPrice?: number;
  endTime?: string;
  views: number;
  totalBids?: number;
  bids?: any[];
  createdAt: string;
  updatedAt: string;
}

export default function MyListingsPage() {
  const { user, token } = useAuthStore();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [activeTab, setActiveTab] = useState<
    "all" | "active" | "sold" | "draft"
  >("all");
  const [selectedType, setSelectedType] = useState<
    "all" | "auction" | "buyNow"
  >("all");

  useEffect(() => {
    if (user?._id && token) {
      fetchMyListings();
    }
  }, [user, token]);

  useEffect(() => {
    filterListings();
  }, [activeTab, selectedType, listings]);

  const fetchMyListings = async () => {
    if (!user?._id) return;

    setIsLoading(true);
    setError(null);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/listing/user/${user._id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }

      const data = await response.json();
      setListings(data);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("Failed to load listings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = [...listings];

    // Filter by status tab
    if (activeTab !== "all") {
      filtered = filtered.filter((listing) => {
        if (activeTab === "active") return listing.status === "ACTIVE";
        if (activeTab === "sold") return listing.status === "SOLD";
        if (activeTab === "draft") return listing.status === "DRAFT";
        return true;
      });
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((listing) => {
        if (selectedType === "auction") return listing.type === "AUCTION";
        if (selectedType === "buyNow") return listing.type === "BUY_NOW";
        return true;
      });
    }

    setFilteredListings(filtered);
  };

  const handleDeleteListing = async (listingId: string) => {
    if (
      !confirm(
        "Sind Sie sicher, dass Sie diesen Eintrag löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
      )
    )
      return;

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/listing/${listingId}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete listing");
      }

      // Remove from state immediately
      setListings((prev) => prev.filter((l) => l._id !== listingId));
    } catch (err) {
      console.error("Error deleting listing:", err);
      alert("Failed to delete listing. Please try again.");
    }
  };

  const getStatusBadge = (status: ListingStatus) => {
    const badges = {
      ACTIVE: {
        color: "bg-green-100 text-green-700",
        icon: CheckCircle,
        label: "Active",
      },
      SOLD: {
        color: "bg-blue-100 text-blue-700",
        icon: CheckCircle,
        label: "Sold",
      },
      EXPIRED: {
        color: "bg-gray-100 text-gray-700",
        icon: XCircle,
        label: "Expired",
      },
      DRAFT: {
        color: "bg-yellow-100 text-yellow-700",
        icon: Pause,
        label: "Draft",
      },
      PAUSED: {
        color: "bg-orange-100 text-orange-700",
        icon: Pause,
        label: "Paused",
      },
    };

    const badge = badges[status] || badges.DRAFT;
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
      >
        <Icon className="w-3 h-3" strokeWidth={2} />
        {badge.label}
      </span>
    );
  };

  const formatPrice = (listing: Listing) => {
    if (listing.type === "AUCTION") {
      const price = listing.currentPrice || listing.startingPrice || 0;
      return `CHF ${price.toLocaleString()}`;
    }
    return `CHF ${(listing.buyNowPrice || 0).toLocaleString()}`;
  };

  const getTimeRemaining = (endTime?: string) => {
    if (!endTime) return null;

    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const stats = {
    total: listings.length,
    active: listings.filter((l) => l.status === "ACTIVE").length,
    sold: listings.filter((l) => l.status === "SOLD").length,
    draft: listings.filter((l) => l.status === "DRAFT").length,
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl  mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#3a3735] mb-2">
            Meine Angebote
          </h1>
          <p className="text-[#5a524b]">Ihre Angebote werden geladen...</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-[#c8a882] animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#3a3735] mb-2">
            Meine Angebote
          </h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 mb-4">{error}</p>
          <button
            onClick={fetchMyListings}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Versuchen Sie es erneut
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#3a3735]">
                Meine Angebote
              </h1>
              <p className="text-[#5a524b]">
                Verwalte deine {listings.length}{" "}
                {listings.length === 1 ? "Anzeige" : "Anzeigen"}
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/listings/new"
            className="px-6 py-3 bg-[#3a3735] text-[#c8a882] rounded-lg hover:bg-[#c8a882] hover:text-[#3a3735] transition-all font-medium"
          >
            + Eintrag erstellen
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#5a524b]">Gesamt</span>
            <span className="text-2xl font-bold text-[#3a3735]">
              {stats.total}
            </span>
          </div>
        </div>
        <div className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#5a524b]">Aktiv</span>
            <span className="text-2xl font-bold text-green-600">
              {stats.active}
            </span>
          </div>
        </div>
        <div className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#5a524b]">Verkauft</span>
            <span className="text-2xl font-bold text-blue-600">
              {stats.sold}
            </span>
          </div>
        </div>
        <div className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#5a524b]">Entwurf</span>
            <span className="text-2xl font-bold text-yellow-600">
              {stats.draft}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Status Tabs */}
          <div className="flex gap-2 flex-wrap">
            {["all", "active", "sold", "draft"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  activeTab === tab
                    ? "bg-[#3a3735] text-[#c8a882]"
                    : "bg-[#f5f1ea] text-[#5a524b] hover:bg-[#e8dfd0]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex gap-2 sm:ml-auto">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === "all"
                  ? "bg-[#3a3735] text-[#c8a882]"
                  : "bg-[#f5f1ea] text-[#5a524b] hover:bg-[#e8dfd0]"
              }`}
            >
              Alle Typen
            </button>
            <button
              onClick={() => setSelectedType("auction")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === "auction"
                  ? "bg-[#3a3735] text-[#c8a882]"
                  : "bg-[#f5f1ea] text-[#5a524b] hover:bg-[#e8dfd0]"
              }`}
            >
              Auktionen
            </button>
            <button
              onClick={() => setSelectedType("buyNow")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === "buyNow"
                  ? "bg-[#3a3735] text-[#c8a882]"
                  : "bg-[#f5f1ea] text-[#5a524b] hover:bg-[#e8dfd0]"
              }`}
            >
              Jetzt kaufen
            </button>
          </div>
        </div>
      </div>

      {/* Listings */}
      {filteredListings.length === 0 ? (
        <div className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-[#f5f1ea] rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-[#d4cec4]" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-semibold text-[#3a3735] mb-3">
              Keine Einträge gefunden
            </h2>
            <p className="text-[#5a524b] mb-6">
              {activeTab !== "all"
                ? `You don't have any ${activeTab} listings yet.`
                : "Start creating your first listing to get started."}
            </p>
            <Link
              href="/dashboard/listings/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#3a3735] text-[#c8a882] rounded-lg hover:bg-[#c8a882] hover:text-[#3a3735] transition-all font-medium"
            >
              <Package className="w-5 h-5" strokeWidth={1.5} />
              Erstellen Sie Ihren ersten Eintrag
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredListings.map((listing) => (
            <div
              key={listing._id}
              className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="flex-shrink-0">
                  <div className="w-full md:w-48 h-48 md:h-40 bg-[#e8dfd0] rounded-lg overflow-hidden relative">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0].url}
                        alt={listing.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#5a524b]">
                        <Package className="w-8 h-8 opacity-50" />
                      </div>
                    )}
                    {/* Status Badge overlay for mobile if needed, or keeping standard */}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-[#3a3735] truncate">
                            {listing.name}
                          </h3>
                          {getStatusBadge(listing.status)}
                          <span className="text-xs px-2 py-1 bg-[#e8dfd0] text-[#5a524b] rounded">
                            {listing.type === "AUCTION" ? "Auction" : "Buy Now"}
                          </span>
                        </div>
                        <p className="text-sm text-[#5a524b] line-clamp-2 mb-3">
                          {listing.description}
                        </p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      {/* Price / Current Bid */}
                      <div className="flex items-center gap-2">
                        <DollarSign
                          className="w-4 h-4 text-[#c8a882]"
                          strokeWidth={1.5}
                        />
                        <div>
                          <span className="text-xs text-[#5a524b] block">
                            {listing.type === "AUCTION"
                              ? "Aktuelles Gebot"
                              : "Preis"}
                          </span>
                          <span className="text-sm font-semibold text-[#3a3735]">
                            {formatPrice(listing)}
                          </span>
                        </div>
                      </div>

                      {/* Bids (if auction) */}
                      {listing.type === "AUCTION" && (
                        <div className="flex items-center gap-2">
                          <TrendingUp
                            className="w-4 h-4 text-[#c8a882]"
                            strokeWidth={1.5}
                          />
                          <div>
                            <span className="text-xs text-[#5a524b] block">
                              Gebote
                            </span>
                            <span className="text-sm font-semibold text-[#3a3735]">
                              {listing.totalBids || listing.bids?.length || 0}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Views */}
                      <div className="flex items-center gap-2">
                        <Eye
                          className="w-4 h-4 text-[#c8a882]"
                          strokeWidth={1.5}
                        />
                        <div>
                          <span className="text-xs text-[#5a524b] block">
                            Ansichten
                          </span>
                          <span className="text-sm font-semibold text-[#3a3735]">
                            {listing.views}
                          </span>
                        </div>
                      </div>

                      {/* Time Remaining */}
                      {listing.type === "AUCTION" &&
                        listing.status === "ACTIVE" && (
                          <div className="flex items-center gap-2">
                            <Clock
                              className="w-4 h-4 text-[#c8a882]"
                              strokeWidth={1.5}
                            />
                            <div>
                              <span className="text-xs text-[#5a524b] block">
                                Zeit übrig
                              </span>
                              <span className="text-sm font-semibold text-[#3a3735]">
                                {getTimeRemaining(listing.endTime)}
                              </span>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-[#d4cec4] mt-auto">
                    <Link
                      href={`/listing/${listing._id}`}
                      className="flex items-center gap-1 text-sm font-medium text-[#3a3735] hover:text-[#c8a882] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" /> Öffentlich anzeigen
                    </Link>

                    <div className="flex-1"></div>

                    <Link
                      href={`/dashboard/listings/edit/${listing._id}`}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#f5f1ea] text-[#3a3735] rounded hover:bg-[#e8dfd0] transition-colors text-sm font-medium"
                    >
                      <Edit className="w-4 h-4" /> Bearbeiten
                    </Link>

                    <button
                      onClick={() => handleDeleteListing(listing._id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" /> Löschen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
