// app/(dashboard)/dashboard/purchases/page.tsx
"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { useEffect, useState } from "react";
import {
  Package,
  Loader2,
  ShoppingBag,
  Gavel,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Eye,
} from "lucide-react";

type PurchaseStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
type PurchaseType = "AUCTION_WIN" | "DIRECT_PURCHASE";

interface Purchase {
  _id: string;
  listing: {
    _id: string;
    name: string;
    images: { url: string }[];
    type: string;
  };
  buyer: string;
  seller: {
    _id: string;
    fullName: string;
  };
  purchaseType: PurchaseType;
  finalPrice: number;
  status: PurchaseStatus;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  shippingInfo?: {
    trackingNumber?: string;
    carrier?: string;
  };
}

export default function PurchasesPage() {
  const { user, token } = useAuthStore();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "auctions" | "direct">(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState<"all" | PurchaseStatus>(
    "all",
  );

  useEffect(() => {
    if (user?._id && token) {
      fetchPurchases();
    }
  }, [user, token]);

  useEffect(() => {
    filterPurchases();
  }, [activeTab, statusFilter, purchases]);

  const fetchPurchases = async () => {
    if (!user?._id) return;

    setIsLoading(true);
    setError(null);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/purchase/user/${user._id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch purchases");
      }

      const data = await response.json();
      setPurchases(data.data || []);
    } catch (err) {
      console.error("Error fetching purchases:", err);
      setError("Failed to load purchases. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filterPurchases = () => {
    let filtered = [...purchases];

    // Filter by type
    if (activeTab === "auctions") {
      filtered = filtered.filter((p) => p.purchaseType === "AUCTION_WIN");
    } else if (activeTab === "direct") {
      filtered = filtered.filter((p) => p.purchaseType === "DIRECT_PURCHASE");
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    setFilteredPurchases(filtered);
  };

  const getStatusBadge = (status: PurchaseStatus) => {
    const badges = {
      PENDING: {
        color: "bg-yellow-100 text-yellow-700",
        icon: Clock,
        label: "Pending Payment",
      },
      PAID: {
        color: "bg-blue-100 text-blue-700",
        icon: CheckCircle,
        label: "Paid",
      },
      SHIPPED: {
        color: "bg-purple-100 text-purple-700",
        icon: Truck,
        label: "Shipped",
      },
      DELIVERED: {
        color: "bg-green-100 text-green-700",
        icon: CheckCircle,
        label: "Delivered",
      },
      CANCELLED: {
        color: "bg-red-100 text-red-700",
        icon: XCircle,
        label: "Cancelled",
      },
    };

    const badge = badges[status];
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}
      >
        <Icon className="w-3 h-3" strokeWidth={2} />
        {badge.label}
      </span>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const stats = {
    total: purchases.length,
    auctions: purchases.filter((p) => p.purchaseType === "AUCTION_WIN").length,
    direct: purchases.filter((p) => p.purchaseType === "DIRECT_PURCHASE")
      .length,
    pending: purchases.filter((p) => p.status === "PENDING").length,
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#3a3735] mb-2">
            Meine Einkäufe
          </h1>
          <p className="text-[#5a524b]">Ihre Kaufhistorie wird geladen...</p>
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
            Meine Einkäufe
          </h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 mb-4">{error}</p>
          <button
            onClick={fetchPurchases}
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
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#3a3735]">
              Meine Einkäufe
            </h1>
            <p className="text-[#5a524b]">
              {purchases.length}{" "}
              {purchases.length === 1 ? "Einkauf" : "Einkäufe"}
            </p>
          </div>
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
            <span className="text-sm text-[#5a524b]">Gewonnene Auktionen</span>
            <span className="text-2xl font-bold text-purple-600">
              {stats.auctions}
            </span>
          </div>
        </div>
        <div className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#5a524b]">Direktkäufe</span>
            <span className="text-2xl font-bold text-blue-600">
              {stats.direct}
            </span>
          </div>
        </div>
        <div className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#5a524b]">Ausstehend</span>
            <span className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Type Tabs */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "bg-[#3a3735] text-[#c8a882]"
                  : "bg-[#f5f1ea] text-[#5a524b] hover:bg-[#e8dfd0]"
              }`}
            >
              Alle Einkäufe
            </button>
            <button
              onClick={() => setActiveTab("auctions")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === "auctions"
                  ? "bg-[#3a3735] text-[#c8a882]"
                  : "bg-[#f5f1ea] text-[#5a524b] hover:bg-[#e8dfd0]"
              }`}
            >
              <Gavel className="w-4 h-4" strokeWidth={1.5} />
              Auktionen
            </button>
            <button
              onClick={() => setActiveTab("direct")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === "direct"
                  ? "bg-[#3a3735] text-[#c8a882]"
                  : "bg-[#f5f1ea] text-[#5a524b] hover:bg-[#e8dfd0]"
              }`}
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
              Direktkäufe
            </button>
          </div>

          {/* Status Filter */}
          <div className="sm:ml-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] rounded-lg text-sm focus:outline-none focus:border-[#c8a882]"
            >
              <option value="all">Alle Status</option>
              <option value="PENDING">Ausstehend</option>
              <option value="PAID">Bezahlt</option>
              <option value="SHIPPED">Versendet</option>
              <option value="DELIVERED">Geliefert</option>
              <option value="CANCELLED">Abgesagt</option>
            </select>
          </div>
        </div>
      </div>

      {/* Purchases List */}
      {filteredPurchases.length === 0 ? (
        <div className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-[#f5f1ea] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag
                className="w-10 h-10 text-[#d4cec4]"
                strokeWidth={1.5}
              />
            </div>
            <h2 className="text-2xl font-semibold text-[#3a3735] mb-3">
              Noch keine Käufe
            </h2>
            <p className="text-[#5a524b] mb-6">
              {activeTab === "all"
                ? "You haven't made any purchases yet. Start shopping to see your orders here."
                : `You haven't ${
                    activeTab === "auctions"
                      ? "won any auctions"
                      : "made any direct purchases"
                  } yet.`}
            </p>
            <a
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#3a3735] text-[#c8a882] rounded-lg hover:bg-[#c8a882] hover:text-[#3a3735] transition-all font-medium"
            >
              <Package className="w-5 h-5" strokeWidth={1.5} />
              Angebote durchsuchen
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPurchases.map((purchase) => (
            <div
              key={purchase._id}
              className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-6">
                {/* Image */}
                <div className="flex-shrink-0">
                  <img
                    src={purchase.listing.images[0]?.url || "/placeholder.jpg"}
                    alt={purchase.listing.name}
                    className="w-32 h-32 object-cover rounded-lg bg-[#e8dfd0]"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-[#3a3735] truncate">
                          {purchase.listing.name}
                        </h3>
                        {getStatusBadge(purchase.status)}
                        <span className="text-xs px-2 py-1 bg-[#e8dfd0] text-[#5a524b] rounded">
                          {purchase.purchaseType === "AUCTION_WIN"
                            ? "Auction Win"
                            : "Direct Buy"}
                        </span>
                      </div>
                      <p className="text-xs text-[#5a524b]">
                        Gekauft am {formatDate(purchase.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Purchase Details */}
                  <div className="flex items-center gap-6 mb-4">
                    <div>
                      <span className="text-xs text-[#5a524b] block mb-1">
                        Endpreis
                      </span>
                      <span className="text-lg font-semibold text-[#c8a882]">
                        CHF {purchase.finalPrice.toLocaleString()}
                      </span>
                    </div>

                    {purchase.shippingInfo?.trackingNumber && (
                      <div>
                        <span className="text-xs text-[#5a524b] block mb-1">
                          Tracking
                        </span>
                        <span className="text-sm font-medium text-[#3a3735]">
                          {purchase.shippingInfo.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <a
                      href={`/listing/${purchase.listing._id}`}
                      className="px-4 py-2 text-sm bg-[#3a3735] text-[#c8a882] rounded-lg hover:bg-[#c8a882] hover:text-[#3a3735] transition-all flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" strokeWidth={1.5} />
                      Artikel ansehen
                    </a>

                    {purchase.status === "PENDING" && (
                      <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Zahlung vollständig
                      </button>
                    )}

                    {purchase.status === "SHIPPED" && (
                      <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Sendung verfolgen
                      </button>
                    )}
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
