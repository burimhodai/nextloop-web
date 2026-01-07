import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import AuctionDetailClient from "./AuctionDetailClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Fetch listing data on the server
async function getListing(id: string) {
  try {
    const response = await fetch(`${API_URL}/listing/${id}`, {
      cache: "no-store", // Always fetch fresh data for auctions
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
      title: "Auction Not Found",
      description: "The requested auction could not be found.",
    };
  }

  // Get main image
  const mainImage =
    listing.images?.find((img: any) => img.type === "MAIN")?.url ||
    listing.images?.[0]?.url ||
    "";

  const currentPrice = listing.currentPrice || listing.startingPrice || 0;
  const seller =
    typeof listing.seller === "object"
      ? listing.seller
      : { username: "Seller" };
  const category =
    typeof listing.category === "object"
      ? listing.category
      : { name: "Collectibles" };

  // Calculate time remaining
  const getTimeRemainingText = () => {
    if (!listing.endTime) return "Auction in progress";
    const now = new Date();
    const end = new Date(listing.endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Auction ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} remaining`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} remaining`;
    return "Ending soon";
  };

  const timeRemaining = getTimeRemainingText();

  const description = listing.description
    ? `${listing.description.slice(0, 155)}...`
    : `Live auction for ${
        listing.name
      }. Current bid: $${currentPrice.toLocaleString()}. ${timeRemaining}. ${
        listing.totalBids || 0
      } bids. Place your bid now!`;

  const title = `${
    listing.name
  } - Live Auction | $${currentPrice.toLocaleString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/auction/${listing._id}`,
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
      siteName: "GoBusly Auctions",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: mainImage ? [mainImage] : [],
    },
    other: {
      "product:price:amount": currentPrice.toString(),
      "product:price:currency": "USD",
      "product:condition": listing.condition?.replace(/_/g, " ") || "Used",
      "product:availability":
        listing.status === "ACTIVE" ? "in stock" : "out of stock",
      "product:category": category.name,
    },
  };
}

// Generate JSON-LD structured data for rich snippets
function generateStructuredData(listing: any) {
  const mainImage =
    listing.images?.find((img: any) => img.type === "MAIN")?.url ||
    listing.images?.[0]?.url ||
    "";
  const currentPrice = listing.currentPrice || listing.startingPrice || 0;
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
    description: listing.description || `Auction for ${listing.name}`,
    image: listing.images?.map((img: any) => img.url) || [mainImage],
    brand: {
      "@type": "Brand",
      name: seller.username,
    },
    category: category.name,
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/auction/${listing._id}`,
      priceCurrency: "USD",
      price: currentPrice,
      priceValidUntil: listing.endTime,
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
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: seller.rating || 5,
      reviewCount: listing.totalBids || 0,
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Total Bids",
        value: listing.totalBids || 0,
      },
      {
        "@type": "PropertyValue",
        name: "Views",
        value: listing.views || 0,
      },
      {
        "@type": "PropertyValue",
        name: "Auction Type",
        value: "Online Auction",
      },
    ],
  };
}

export default async function AuctionPage({
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

  // If it's not an auction, redirect to regular listing page
  if (listing.type !== "AUCTION") {
    redirect(`/listing/${id}`);
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
      <AuctionDetailClient initialListing={listing} />
    </>
  );
}

// Optional: Generate static params for popular auctions (ISR)
// Uncomment if you want to pre-render some auctions at build time
/*
export async function generateStaticParams() {
  try {
    const response = await fetch(`${API_URL}/search?type=AUCTION&limit=20`);
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data.map((listing: any) => ({
        id: listing._id,
      }));
    }
  } catch (error) {
    console.error("Error generating static params:", error);
  }
  
  return [];
}
*/
