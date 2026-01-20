import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ListingDetailClient from "./ListingDetailClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Fetch listing data on the server
async function getListing(id: string) {
  try {
    const response = await fetch(`${API_URL}/listing/${id}`, {
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching listing:", error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) {
    return {
      title: "Listing Not Found",
      description: "The requested listing could not be found.",
    };
  }

  // Get main image
  const mainImage =
    listing.images?.find((img: any) => img.type === "MAIN")?.url ||
    listing.images?.[0]?.url ||
    "";

  const price = listing.buyNowPrice || 0;
  const seller =
    typeof listing.seller === "object"
      ? listing.seller
      : { username: "Seller" };
  const category =
    typeof listing.category === "object"
      ? listing.category
      : { name: "Collectibles" };

  const description = listing.description
    ? `${listing.description.slice(0, 155)}...`
    : `Kaufen Sie ${listing.name} für CHF${price.toLocaleString()}. ${formatCondition(listing.condition)} Zustand. ${listing.views || 0} Aufrufe. Jetzt kaufen!`;

  const title = `${listing.name} - CHF${price.toLocaleString()} | Jetzt kaufen`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/listing/${listing._id}`,
      images: mainImage
        ? [
            {
              url: mainImage,
              width: 1200,
              height: 630,
              alt: listing.name,
            },
          ]
        : [],
      siteName: "Nextloop",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: mainImage ? [mainImage] : [],
    },
    other: {
      "product:price:amount": price.toString(),
      "product:price:currency": "CHF",
      "product:condition": listing.condition?.replace(/_/g, " ") || "Used",
      "product:availability":
        listing.status === "ACTIVE" ? "in stock" : "out of stock",
      "product:category": category.name,
    },
  };
}

// Helper function
function formatCondition(condition: string): string {
  return condition.replace(/_/g, " ");
}

// Generate JSON-LD structured data for rich snippets
function generateStructuredData(listing: any) {
  const mainImage =
    listing.images?.find((img: any) => img.type === "MAIN")?.url ||
    listing.images?.[0]?.url ||
    "";
  const price = listing.buyNowPrice || 0;
  const seller =
    typeof listing.seller === "object"
      ? listing.seller
      : { username: "Seller", rating: 5 };
  const category =
    typeof listing.category === "object"
      ? listing.category
      : { name: "Collectibles" };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.name,
    description: listing.description || `Buy ${listing.name}`,
    image: listing.images?.map((img: any) => img.url) || [mainImage],
    brand: {
      "@type": "Brand",
      name: seller.username,
    },
    category: category.name,
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/listing/${listing._id}`,
      priceCurrency: "CHF",
      price: price,
      itemCondition: `https://schema.org/${
        listing.condition === "NEW"
          ? "NewCondition"
          : listing.condition === "LIKE_NEW"
            ? "RefurbishedCondition"
            : "UsedCondition"
      }`,
      availability:
        listing.status === "ACTIVE"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: seller.username,
      },
      shippingDetails: listing.shippingCost
        ? {
            "@type": "OfferShippingDetails",
            shippingRate: {
              "@type": "MonetaryAmount",
              value: listing.shippingCost,
              currency: "CHF",
            },
          }
        : undefined,
    },
    aggregateRating: seller.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: seller.rating,
          reviewCount: listing.views || 1,
        }
      : undefined,
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);

  // If listing doesn't exist
  if (!listing) {
    notFound();
  }

  // If it's an auction, redirect to auction page
  if (listing.type === "AUCTION") {
    redirect(`/auction/${id}`);
  }

  const structuredData = generateStructuredData(listing);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Client Component */}
      <ListingDetailClient initialListing={listing} />
    </>
  );
}
