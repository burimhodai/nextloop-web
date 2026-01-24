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
  Wrench,
  Sparkles,
  WashingMachine,
  BookOpen,
  Shirt,
  Smartphone,
  Car,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SearchForm } from "./search/search-form";

const quickCategories = [
  {
    name: "Büecher",
    value: "68efbca6338bab05c44f7421",
    icon: <BookOpen className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    name: "Chleider",
    value: "68efbca3338bab05c44f741f",
    icon: <Shirt className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    name: "Elektronik",
    value: "68efbc8f338bab05c44f741b",
    icon: <Smartphone className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    name: "Fahrzüg",
    value: "68ef91c7749f9676f3206477",
    icon: <Car className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    name: "Huushaltsgrät",
    value: "68efbcc3338bab05c44f7429",
    icon: <WashingMachine className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    name: "Schönheit",
    value: "68efbccb338bab05c44f742d",
    icon: <Sparkles className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    name: "Möbel",
    value: "68efbc9e338bab05c44f741d",
    icon: <Armchair className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    name: "Wärchzüg",
    value: "68efbcab338bab05c44f7423",
    icon: <Wrench className="w-5 h-5" strokeWidth={1.5} />,
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
            Für Dinge, die bleiben.
          </h1>

          <p className="text-lg text-[#5a524b] leading-relaxed max-w-2xl mx-auto mb-10">
            Kaufen oder bieten. Verifizierte Verkäufer. Kuratierte Auswahl.
          </p>

          {/* Search Form Component */}
          <SearchForm showPopularSearches={true} className="mb-12" />

          {/* Quick Categories */}
          <div className="w-full max-w-4xl mx-auto" id="hero-categories">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#3A3735]"></div>
              <span className="text-[#3A3735] text-xs tracking-[0.2em] uppercase font-medium">
                Kategorien entdecken
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
