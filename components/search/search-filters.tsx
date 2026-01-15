"use client";

import { X } from "lucide-react";

interface Category {
  _id: string;
  name: string;
}

interface SearchFiltersProps {
  categories: Category[];
  filters: {
    category: string;
    minPrice: string;
    maxPrice: string;
    conditions: string[];
    type: string;
  };
  setFilters: (key: string, value: any) => void;
  resetFilters: () => void;
  activeCount: number;
}

const CONDITIONS = [
  { value: "NEW", label: "Neu" },
  { value: "LIKE_NEW", label: "Wie neu" },
  { value: "VERY_GOOD", label: "Sehr gut" },
  { value: "GOOD", label: "Gut" },
  { value: "FAIR", label: "Akzeptabel" },
];

export const SearchFilters = ({
  categories,
  filters,
  setFilters,
  resetFilters,
  activeCount,
}: SearchFiltersProps) => {
  const toggleCondition = (condition: string) => {
    const current = filters.conditions;
    const updated = current.includes(condition)
      ? current.filter((c) => c !== condition)
      : [...current, condition];
    setFilters("condition", updated);
  };

  return (
    <div className="w-64 flex-shrink-0 hidden md:block">
      <div className="bg-white p-6 shadow-sm sticky top-32 rounded-sm border border-[#d4cec4]/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[#3a3735] font-semibold text-lg font-serif">
            Filter
          </h3>
          {activeCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-[#c8a882] text-xs hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Zürücksetzen
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="mb-6">
          <label className="block text-[#3a3735] text-xs uppercase tracking-wider font-medium mb-3">
            Kategorie
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters("category", e.target.value)}
            className="w-full px-3 py-2 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] text-sm focus:outline-none focus:border-[#c8a882] rounded-sm"
          >
            <option value="">Alle Kategorien</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-[#3a3735] text-xs uppercase tracking-wider font-medium mb-3">
            Preisbereich
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters("minPrice", e.target.value)}
              placeholder="Min"
              className="w-full px-3 py-2 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] text-sm focus:outline-none focus:border-[#c8a882] rounded-sm"
            />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters("maxPrice", e.target.value)}
              placeholder="Max"
              className="w-full px-3 py-2 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] text-sm focus:outline-none focus:border-[#c8a882] rounded-sm"
            />
          </div>
        </div>

        {/* Conditions */}
        <div className="mb-6">
          <label className="block text-[#3a3735] text-xs uppercase tracking-wider font-medium mb-3">
            Zustand
          </label>
          <div className="space-y-2">
            {CONDITIONS.map((cond) => (
              <label
                key={cond.value}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.conditions.includes(cond.value)}
                  onChange={() => toggleCondition(cond.value)}
                  className="w-4 h-4 accent-[#c8a882] cursor-pointer"
                />
                <span className="text-[#5a524b] text-sm group-hover:text-[#c8a882] transition-colors">
                  {cond.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Listing Type */}
        <div className="mb-6">
          <label className="block text-[#3a3735] text-xs uppercase tracking-wider font-medium mb-3">
            Typ
          </label>
          <select
            value={filters.type}
            onChange={(e) => setFilters("type", e.target.value)}
            className="w-full px-3 py-2 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] text-sm focus:outline-none focus:border-[#c8a882] rounded-sm"
          >
            <option value="">Alle Typen</option>
            <option value="AUCTION">Auktion</option>
            <option value="DIRECT_BUY">Sofort-Kauf</option>
          </select>
        </div>
      </div>
    </div>
  );
};
