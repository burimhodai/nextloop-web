"use client";


import { Watch, Palette, Laptop, Gem, Armchair, Wine, Camera, Music } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
  count: number;
}

const categories: Category[] = [
  {
    id: 1,
    name: "Uhren & Zeitmesser",
    icon: <Watch className="w-8 h-8" strokeWidth={1.5} />,
    count: 1247
  },
  {
    id: 2,
    name: "Kunstwerke",
    icon: <Palette className="w-8 h-8" strokeWidth={1.5} />,
    count: 892
  },
  {
    id: 3,
    name: "Elektronik",
    icon: <Laptop className="w-8 h-8" strokeWidth={1.5} />,
    count: 2341
  },
  {
    id: 4,
    name: "Schmuck & Juwelen",
    icon: <Gem className="w-8 h-8" strokeWidth={1.5} />,
    count: 1567
  },
  {
    id: 5,
    name: "Möbel & Design",
    icon: <Armchair className="w-8 h-8" strokeWidth={1.5} />,
    count: 734
  },
  {
    id: 6,
    name: "Wine & Spirits",
    icon: <Wine className="w-8 h-8" strokeWidth={1.5} />,
    count: 423
  },
  {
    id: 7,
    name: "Sammlerstücke",
    icon: <Camera className="w-8 h-8" strokeWidth={1.5} />,
    count: 1891
  },
  {
    id: 8,
    name: "Instrumente",
    icon: <Music className="w-8 h-8" strokeWidth={1.5} />,
    count: 312
  }
];

export function Categories() {
  return (
    <section className="py-24 bg-[#faf8f4]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-[#c8a882]"></div>
            <span className="text-[#c8a882] text-sm tracking-[0.2em] uppercase">
              Kategorien entdecken
            </span>
            <div className="h-px w-12 bg-[#c8a882]"></div>
          </div>
          <h2
            className="text-[#3a3735] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Kollektionen entdecken
          </h2>
          <p className="text-[#5a524b] max-w-2xl mx-auto">
            Entdecke kuratierte Kategorien mit außergewöhnlichen Stücken aus aller Welt.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group bg-[#f5f1ea] hover:bg-white p-8 text-center cursor-pointer transition-all duration-500 shadow-sm hover:shadow-xl border border-transparent hover:border-[#c8a882]"
            >
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 flex items-center justify-center bg-white group-hover:bg-[#c8a882] text-[#3a3735] group-hover:text-white transition-colors shadow-sm">
                  {category.icon}
                </div>
              </div>
              <h3
                className="text-[#3a3735] mb-2 group-hover:text-[#c8a882] transition-colors"
                style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.125rem' }}
              >
                {category.name}
              </h3>
              <p className="text-[#5a524b] text-sm">
                {category.count.toLocaleString()} Artikel
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="text-[#3a3735] hover:text-[#c8a882] text-sm tracking-wide border-b border-[#3a3735] hover:border-[#c8a882] pb-1 transition-colors">
            Suchen in allen Kategorien
          </button>
        </div>
      </div>
    </section>
  );
}
