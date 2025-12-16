// services/listings/index.ts

import { IListing, ImageTypes, IBid } from "@/lib/types/listing.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Fetch a single listing by ID
 */
export const fetchListingById = async (id: string): Promise<IListing> => {
  try {
    const response = await fetch(`${API_URL}/listing/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch listing: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching listing:", error);
    throw error;
  }
};

/**
 * Create checkout session for direct buy
 */
export interface CreateCheckoutParams {
  listingId: string;
  userId: string;
}

export interface CheckoutResponse {
  success: boolean;
  data: {
    sessionId: string;
    url: string;
  };
  message?: string;
}

export const createCheckoutSession = async (
  params: CreateCheckoutParams
): Promise<CheckoutResponse> => {
  try {
    const response = await fetch(`${API_URL}/payment/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create checkout session");
    }

    return data;
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
};

/**
 * Verify checkout session after payment
 */
export const verifyCheckoutSession = async (sessionId: string) => {
  try {
    const response = await fetch(`${API_URL}/payment/verify-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to verify session");
    }

    return data;
  } catch (error) {
    console.error("Error verifying session:", error);
    throw error;
  }
};

/**
 * Place a bid on an auction
 */
export interface PlaceBidParams {
  listingId: string;
  bidderId: string;
  amount: number;
}

export interface PlaceBidResponse {
  message: string;
  listing: IListing;
  extended?: boolean;
  extensionsRemaining?: number;
  minimumBid?: number;
}

export const placeBid = async (
  params: PlaceBidParams
): Promise<PlaceBidResponse> => {
  try {
    const response = await fetch(`${API_URL}/listing/${params.listingId}/bid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bidderId: params.bidderId,
        amount: params.amount,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to place bid");
    }

    return data;
  } catch (error) {
    console.error("Error placing bid:", error);
    throw error;
  }
};

/**
 * Search/filter listings
 */
export interface SearchParams {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
  status?: string;
  type?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  success: boolean;
  data: IListing[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const searchListings = async (
  params: SearchParams
): Promise<SearchResponse> => {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.set(key, String(value));
      }
    });

    const response = await fetch(`${API_URL}/search?${queryParams.toString()}`);

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching listings:", error);
    throw error;
  }
};

/**
 * Get the main image from a listing
 */
export const getMainImage = (listing: IListing): string => {
  const mainImage = listing.images?.find((img) => img.type === ImageTypes.MAIN);
  return mainImage?.url || listing.images?.[0]?.url || "/placeholder.jpg";
};

/**
 * Get listing price based on type
 */
export const getListingPrice = (listing: IListing): number => {
  return listing.type === "AUCTION"
    ? listing.currentPrice || listing.startingPrice || 0
    : listing.buyNowPrice || 0;
};

/**
 * Get price label based on listing type
 */
export const getPriceLabel = (listing: IListing): string => {
  if (listing.type === "AUCTION") {
    return listing.currentPrice ? "Current Bid" : "Starting Bid";
  }
  return "Buy Now";
};

/**
 * Get listing URL based on type
 */
export const getListingUrl = (listing: IListing): string => {
  return listing.type === "AUCTION"
    ? `/auction/${listing._id}`
    : `/listing/${listing._id}`;
};

/**
 * Format time remaining for auctions
 */
export const getTimeRemaining = (endTime?: string | Date): string | null => {
  if (!endTime) return null;

  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

/**
 * Check if auction has ended
 */
export const isAuctionEnded = (endTime?: string | Date): boolean => {
  if (!endTime) return false;
  return new Date(endTime).getTime() <= Date.now();
};

/**
 * Check if auction has started
 */
export const isAuctionStarted = (startTime?: string | Date): boolean => {
  if (!startTime) return true;
  return new Date(startTime).getTime() <= Date.now();
};

/**
 * Format condition for display
 */
export const formatCondition = (condition: string): string => {
  return condition.replace(/_/g, " ");
};

/**
 * Get minimum bid amount
 */
export const getMinimumBid = (listing: IListing): number => {
  if (listing.currentPrice) {
    return listing.currentPrice + (listing.bidIncrement || 0);
  }
  return listing.startingPrice || 0;
};

/**
 * Get bid history sorted by timestamp (newest first)
 */
export const getBidHistory = (listing: IListing): IBid[] => {
  if (!listing.bids || listing.bids.length === 0) return [];

  return [...listing.bids].sort((a, b) => {
    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return timeB - timeA;
  });
};

export interface WishlistResponse {
  message: string;
  isInWatchlist?: boolean;
  watchlistCount?: number;
  watchlist?: any[];
  count?: number;
}

export const toggleWatchlist = async (
  listingId: string,
  userId: string,
  token?: string
): Promise<WishlistResponse> => {
  try {
    const response = await fetch(`${API_URL}/watchlist/toggle/${listingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to toggle watchlist");
    }

    return data;
  } catch (error) {
    console.error("Error toggling watchlist:", error);
    throw error;
  }
};

/**
 * Add item to watchlist
 */
export const addToWatchlist = async (
  listingId: string,
  userId: string,
  token?: string
): Promise<WishlistResponse> => {
  try {
    const response = await fetch(`${API_URL}/watchlist/${listingId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add to watchlist");
    }

    return data;
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    throw error;
  }
};

/**
 * Remove item from watchlist
 */
export const removeFromWatchlist = async (
  listingId: string,
  userId: string,
  token?: string
): Promise<WishlistResponse> => {
  try {
    const response = await fetch(`${API_URL}/watchlist/${listingId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to remove from watchlist");
    }

    return data;
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    throw error;
  }
};

/**
 * Get user's watchlist
 */
export const getWatchlist = async (
  userId: string,
  token?: string
): Promise<any[]> => {
  try {
    const response = await fetch(`${API_URL}/watchlist/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch watchlist");
    }

    return data.watchlist || [];
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    throw error;
  }
};

/**
 * Check if listing is in watchlist
 */
export const isInWatchlist = async (
  listingId: string,
  userId: string,
  token?: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/watchlist/check/${listingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to check watchlist status");
    }

    return data.isInWatchlist || false;
  } catch (error) {
    console.error("Error checking watchlist:", error);
    return false;
  }
};
