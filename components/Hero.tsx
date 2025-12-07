"use client";
import {
  Watch,
  Palette,
  Laptop,
  Gem,
  Armchair,
  Wine,
  Camera,
  Music,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SearchForm } from "./search/search-form";

const quickCategories = [
  {
    name: "Watches",
    value: "Watches & Timepieces",
    icon: <Watch className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    name: "Art",
    value: "Fine Art",
    icon: <Palette className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    name: "Electronics",
    value: "Electronics",
    icon: <Laptop className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    name: "Jewelry",
    value: "Jewelry & Gems",
    icon: <Gem className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    name: "Furniture",
    value: "Furniture & Design",
    icon: <Armchair className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    name: "Wine",
    value: "Wine & Spirits",
    icon: <Wine className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    name: "Collectibles",
    value: "Collectibles",
    icon: <Camera className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    name: "Instruments",
    value: "Musical Instruments",
    icon: <Music className="w-5 h-5" strokeWidth={1.5} />,
  },
];

export function Hero() {
  const router = useRouter();

  const handleCategoryClick = (categoryValue: string) => {
    router.push(`/search?category=${encodeURIComponent(categoryValue)}`);
  };

  return (
    <section className="relative bg-gradient-to-b from-[#faf8f4] to-[#f5f1ea] py-16 overflow-hidden">
      {/* Mountain backgrounds */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left mountain - hidden on mobile */}
        <div className="hidden md:block absolute left-0 top-0 w-1/2 h-full opacity-80">
          <Image
            src="/mountain-left.png"
            alt=""
            width={800}
            height={1000}
            className="absolute -left-12 top-32 w-full h-auto"
            priority
          />
        </div>

        {/* Right mountain - visible on all screens */}
        <div className="absolute right-0 top-0 w-2/3 md:w-1/2 h-full opacity-80">
          <Image
            src="/mountain-right.png"
            alt=""
            width={800}
            height={1000}
            className="absolute sm:right-0 sm:top-42 sm:scale-100 scale-400 top-65 w-full h-auto"
            priority
          />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Hero Content */}
        <div className="text-center mb-12">
          <h1
            className="text-5xl md:text-6xl lg:text-7xl text-[#3a3735] mb-6 leading-[1.1]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Find Extraordinary Items
          </h1>

          <p className="text-lg text-[#5a524b] leading-relaxed max-w-2xl mx-auto mb-10">
            Browse thousands of luxury auctions from verified sellers worldwide.
            Discover rare timepieces, fine art, collectibles, and more.
          </p>

          {/* Search Form Component */}
          <SearchForm showPopularSearches={true} className="mb-12" />

          {/* Quick Categories */}
          <div className="w-full max-w-4xl mx-auto" id="hero-categories">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#3A3735]"></div>
              <span className="text-[#3A3735] text-xs tracking-[0.2em] uppercase font-medium">
                Browse Categories
              </span>
              <div className="h-px w-8 bg-[#3A3735]"></div>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {quickCategories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleCategoryClick(category.value)}
                  className="group bg-white hover:bg-[#c8a882] p-4 flex flex-col items-center gap-2 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="text-[#3a3735] group-hover:text-white transition-colors">
                    {category.icon}
                  </div>
                  <span className="text-[#3a3735] group-hover:text-white text-xs transition-colors">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
