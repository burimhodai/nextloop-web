// app/(dashboard)/dashboard/page.tsx
"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { useEffect, useState } from "react";
import { getWatchlist, searchListings } from "@/services/listings";
import {
  TrendingUp,
  Package,
  Heart,
  DollarSign,
  Clock,
  Award,
  ShoppingBag,
  Gavel,
  Loader2,
} from "lucide-react";

interface DashboardStats {
  activeListings: number;
  totalSales: number;
  watchlistItems: number;
  activeBids: number;
  revenue: number;
  rating: number;
}

interface Activity {
  id: string;
  type: "bid" | "sale" | "watchlist" | "listing";
  title: string;
  time: string;
  amount?: string;
  listing?: any;
}

export default function DashboardPage() {
  const { user, token } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    activeListings: 0,
    totalSales: 0,
    watchlistItems: 0,
    activeBids: 0,
    revenue: 0,
    rating: 0,
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?._id && token) {
      fetchDashboardData();
    }
  }, [user, token]);

  const fetchDashboardData = async () => {
    if (!user?._id || !token) return;

    setIsLoading(true);

    try {
      // Fetch user's listings
      const userListingsResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/listing/user/${user._id}`,
      );
      const userListings = await userListingsResponse.json();

      // Fetch watchlist
      const watchlist = await getWatchlist(user._id, token);

      // Calculate stats from real data
      const activeListings = userListings.filter(
        (l: any) => l.status === "ACTIVE",
      ).length;

      const soldListings = userListings.filter((l: any) => l.status === "SOLD");

      const totalRevenue = soldListings.reduce((sum: number, listing: any) => {
        return sum + (listing.currentPrice || listing.buyNowPrice || 0);
      }, 0);

      // Count active bids (auctions where user has bid)
      const activeBids = userListings.filter(
        (l: any) => l.type === "AUCTION" && l.bids && l.bids.length > 0,
      ).length;

      setStats({
        activeListings,
        totalSales: soldListings.length,
        watchlistItems: watchlist.length,
        activeBids,
        revenue: totalRevenue,
        rating: user.rating || 0,
      });

      // Generate recent activity from listings
      const activities: Activity[] = [];

      // Add recent bids
      userListings
        .filter((l: any) => l.type === "AUCTION" && l.bids && l.bids.length > 0)
        .slice(0, 3)
        .forEach((listing: any) => {
          const latestBid = listing.bids[listing.bids.length - 1];
          activities.push({
            id: `bid-${listing._id}`,
            type: "bid",
            title: `Neues Gebot auf ${listing.name}`,
            time: formatTimeAgo(latestBid.timestamp || listing.updatedAt),
            amount: `$${latestBid.amount?.toLocaleString()}`,
            listing,
          });
        });

      // Add recent sales
      soldListings.slice(0, 2).forEach((listing: any) => {
        activities.push({
          id: `sale-${listing._id}`,
          type: "sale",
          title: `${listing.name} sold`,
          time: formatTimeAgo(listing.updatedAt),
          amount: `$${(
            listing.currentPrice || listing.buyNowPrice
          )?.toLocaleString()}`,
          listing,
        });
      });

      // Add watchlist items
      watchlist.slice(0, 2).forEach((listing: any) => {
        activities.push({
          id: `watch-${listing._id}`,
          type: "watchlist",
          title: `Aufpassen ${listing.name}`,
          time: "Kürzlich hinzugefügt",
          amount: `$${(
            listing.currentPrice || listing.buyNowPrice
          )?.toLocaleString()}`,
          listing,
        });
      });

      // Sort by most recent and limit to 5
      setRecentActivity(activities.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Soeben";
    if (diffMins < 60)
      return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
    if (diffHours < 24)
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    if (diffDays < 7)
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    return past.toLocaleDateString();
  };

  const statCards = [
    {
      title: "Aktive Angebote",
      value: stats.activeListings,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      iconBg: "bg-blue-100",
      link: "/dashboard/listings",
    },
    {
      title: "Gesamtertrag",
      value: `CHF ${stats.revenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-green-50 text-green-600",
      iconBg: "bg-green-100",
    },
    {
      title: "Aktive Gebote",
      value: stats.activeBids,
      icon: Gavel,
      color: "bg-purple-50 text-purple-600",
      iconBg: "bg-purple-100",
    },
    {
      title: "Watchlist",
      value: stats.watchlistItems,
      icon: Heart,
      color: "bg-red-50 text-red-600",
      iconBg: "bg-red-100",
      link: "/dashboard/watchlist",
    },
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#3a3735] mb-2">
            Willkommen zurück, {user?.fullName.split(" ")[0]}!
          </h1>
          <p className="text-[#5a524b]">Dashboard wird geladen...</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-[#c8a882] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#3a3735] mb-2">
          Willkommen zurück, {user?.fullName.split(" ")[0]}!
        </h1>
        <p className="text-[#5a524b]">
          Hier ist, was mit Ihrem Konto heute passiert.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const CardWrapper = stat.link ? "a" : "div";
          return (
            <CardWrapper
              key={stat.title}
              href={stat.link}
              className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                  <Icon
                    className={`w-6 h-6 ${stat.color.split(" ")[1]}`}
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#3a3735] mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-[#5a524b]">{stat.title}</p>
            </CardWrapper>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#3a3735]">
              Aktuelle Aktivitäten
            </h2>
            <button
              onClick={fetchDashboardData}
              className="text-sm text-[#c8a882] hover:text-[#3a3735] transition-colors"
            >
              Aktualisieren
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 bg-[#f5f1ea] rounded-lg hover:bg-[#e8dfd0] transition-colors"
                >
                  <div className="flex-shrink-0">
                    {activity.type === "bid" && (
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Gavel
                          className="w-5 h-5 text-purple-600"
                          strokeWidth={1.5}
                        />
                      </div>
                    )}
                    {activity.type === "sale" && (
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <ShoppingBag
                          className="w-5 h-5 text-green-600"
                          strokeWidth={1.5}
                        />
                      </div>
                    )}
                    {activity.type === "watchlist" && (
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Heart
                          className="w-5 h-5 text-red-600"
                          strokeWidth={1.5}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#3a3735] mb-1">
                      {activity.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#5a524b]">{activity.time}</p>
                      {activity.amount && (
                        <p className="text-sm font-semibold text-[#c8a882]">
                          {activity.amount}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Clock
                  className="w-12 h-12 text-[#d4cec4] mx-auto mb-4"
                  strokeWidth={1.5}
                />
                <p className="text-[#5a524b]">Keine aktuellen Aktivitäten</p>
                <p className="text-sm text-[#5a524b] mt-2">
                  Erstellen Sie Angebote oder geben Sie Gebote bei Auktionen ab.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#3a3735] mb-4">
              Schnellaktionen
            </h2>
            <div className="space-y-3">
              <a
                href="/dashboard/listings/new"
                className="flex items-center gap-3 p-3 bg-[#3a3735] text-[#c8a882] rounded-lg hover:bg-[#c8a882] hover:text-[#3a3735] transition-all"
              >
                <Package className="w-5 h-5" strokeWidth={1.5} />
                <span className="font-medium">Anzeige erstellen</span>
              </a>
              <a
                href="/dashboard/listings"
                className="flex items-center gap-3 p-3 bg-[#f5f1ea] text-[#3a3735] rounded-lg hover:bg-[#e8dfd0] transition-colors"
              >
                <Package className="w-5 h-5" strokeWidth={1.5} />
                <span className="font-medium">Meine Angebote</span>
              </a>
              <a
                href="/dashboard/watchlist"
                className="flex items-center gap-3 p-3 bg-[#f5f1ea] text-[#3a3735] rounded-lg hover:bg-[#e8dfd0] transition-colors"
              >
                <Heart className="w-5 h-5" strokeWidth={1.5} />
                <span className="font-medium">Merkliste</span>
              </a>
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#3a3735] mb-4">
              Kontostatistiken
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#c8a882]" strokeWidth={1.5} />
                  <span className="text-sm text-[#5a524b]">Bewertung</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-[#c8a882]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold text-[#3a3735]">
                    {stats.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag
                    className="w-5 h-5 text-[#c8a882]"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm text-[#5a524b]">Gesamtumsatz</span>
                </div>
                <span className="font-semibold text-[#3a3735]">
                  {stats.totalSales}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign
                    className="w-5 h-5 text-[#c8a882]"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm text-[#5a524b]">Gleichgewicht</span>
                </div>
                <span className="font-semibold text-[#3a3735]">
                  CHF {user?.balance?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
