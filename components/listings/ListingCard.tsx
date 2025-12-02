// components/listings/ListingCard.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: Array<{ url: string; type: string }>;
  condition: string;
  status: string;
  type: "DIRECT_BUY" | "AUCTION";
  createdAt: string;
  views?: number;
  category?: {
    _id: string;
    name: string;
  };
  boost?: {
    type: string;
    endTime: string;
    status: string;
  };
}

interface ListingCardProps {
  listing: Listing;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onBoost?: (id: string) => void;
  showActions?: boolean;
  variant?: "default" | "compact";
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onEdit,
  onDelete,
  onBoost,
  showActions = true,
  variant = "default",
}) => {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "SOLD":
        return "bg-gray-100 text-gray-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionLabel = (condition: string) => {
    return condition.replace(/_/g, " ");
  };

  const mainImage =
    listing.images?.find((img) => img.type === "MAIN") || listing.images?.[0];

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {listing.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            CHF {listing.price.toFixed(2)}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            listing.status
          )}`}
        >
          {listing.status}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
      {/* Image */}
      <div
        className="relative h-48 bg-gray-100 cursor-pointer group"
        onClick={() => router.push(`/listing/${listing._id}`)}
      >
        {mainImage ? (
          <img
            src={mainImage.url}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              listing.status
            )}`}
          >
            {listing.status}
          </span>

          {listing.boost?.status === "ACTIVE" && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              🚀 Boosted
            </span>
          )}

          {listing.type === "AUCTION" && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              🔨 Auction
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3
            className="font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-gray-700"
            onClick={() => router.push(`/listing/${listing._id}`)}
          >
            {listing.title}
          </h3>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {listing.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              CHF {listing.price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Condition: {getConditionLabel(listing.condition)}
            </p>
          </div>

          {listing.views !== undefined && (
            <div className="text-right">
              <p className="text-sm text-gray-600">{listing.views} views</p>
            </div>
          )}
        </div>

        {listing.category && (
          <div className="mb-3">
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {listing.category.name}
            </span>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            <button
              onClick={() => router.push(`/listing/${listing._id}`)}
              className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              View
            </button>

            {onEdit && (
              <button
                onClick={() => onEdit(listing._id)}
                className="flex-1 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Edit
              </button>
            )}

            {onBoost && listing.status === "ACTIVE" && !listing.boost && (
              <button
                onClick={() => onBoost(listing._id)}
                className="flex-1 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                🚀 Boost
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(listing._id)}
                className="px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
