"use client";
import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchFormProps {
  defaultQuery?: string;
  defaultCategory?: string;
  showPopularSearches?: boolean;
  compact?: boolean;
  className?: string;
}

const categories = [
  "Uhren & Zeitmesser",
  "Bildende Kunst",
  "Elektronik",
  "Schmuck & Edelsteine",
  "Möbel & Design",
  "Wein & Spirituosen",
  "Sammlerstücke",
  "Musikinstrumente",
];

// const popularSearches = ["Rolex", "Vintage Kunst", "Ferrari", "Hermès"];

export function SearchForm({
  defaultQuery = "",
  defaultCategory = "",
  showPopularSearches = true,
  compact = false,
  className = "",
}: SearchFormProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(defaultQuery);
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedCategory) params.set("category", selectedCategory);

    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ""}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    const params = new URLSearchParams();
    params.set("q", term);
    if (selectedCategory) params.set("category", selectedCategory);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div
      className={`bg-white p-6 shadow-lg w-full max-w-4xl mx-auto ${className}`}
    >
      <div
        className={`flex flex-col md:flex-row gap-3 ${
          showPopularSearches ? "mb-4" : ""
        }`}
      >
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5a524b]"
            strokeWidth={1.5}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Suche nach Artikeln, Marken oder Stichworten..."
            className="w-full pl-12 pr-4 py-3.5 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] placeholder:text-[#5a524b]/60 focus:outline-none focus:border-[#c8a882] focus:bg-white transition-all"
          />
        </div>

        {/* Category Dropdown */}
        {!compact && (
          <div className="relative w-full md:w-56">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] focus:outline-none focus:border-[#c8a882] focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="">Alle Kategorien</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a524b] pointer-events-none"
              strokeWidth={1.5}
            />
          </div>
        )}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="group bg-[#3a3735] hover:bg-[#c8a882] text-[#faf8f4] hover:text-[#3a3735] px-8 py-3.5 flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
        >
          <Search className="w-4 h-4" strokeWidth={1.5} />
          <span className="tracking-wide">Suchen</span>
        </button>
      </div>

      {/* Popular Searches */}
      {/* {showPopularSearches && (
        <div className="flex items-center justify-center gap-4 text-xs text-[#5a524b] flex-wrap">
          <span>Beliebt:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => handlePopularSearch(term)}
              className="hover:text-[#c8a882] transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      )} */}
    </div>
  );
}
