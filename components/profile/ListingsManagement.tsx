import { Edit, Trash2, TrendingUp, Eye, Gavel, Clock, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface Listing {
  id: number;
  title: string;
  price: number;
  status: 'Aktiv' | 'Entwurf' | 'Storniert' | 'Verkauft';
  views: number;
  bids: number;
  timeRemaining: string;
  image: string;
}

const listings: Listing[] = [
  {
    id: 1,
    title: "Patek Philippe Nautilus 5711/1A",
    price: 145000,
    status: "Aktiv",
    views: 2847,
    bids: 23,
    timeRemaining: "2 Tage",
    image: "https://images.unsplash.com/photo-1554151447-b9d2197448f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzYzMDM0MzMzfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 2,
    title: "Cartier Love Bracelet 18K Gold",
    price: 8500,
    status: "Aktiv",
    views: 1523,
    bids: 12,
    timeRemaining: "5 Stunden",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwZGlhbW9uZHxlbnwxfHx8fDE3NjMwNDM5OTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 3,
    title: "Eames Lounge Chair Original 1956",
    price: 18500,
    status: "Entwurf",
    views: 0,
    bids: 0,
    timeRemaining: "Nicht gelistet",
    image: "https://images.unsplash.com/photo-1760716478137-d861d5b354e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmdXJuaXR1cmUlMjBjaGFpcnxlbnwxfHx8fDE3NjMxMjI3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 4,
    title: "Château Margaux 1900 Pristine",
    price: 52000,
    status: "Verkauft",
    views: 3421,
    bids: 45,
    timeRemaining: "Beendet",
    image: "https://images.unsplash.com/photo-1734490037300-6ff9ffd4ed13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwd2luZSUyMGNlbGxhcnxlbnwxfHx8fDE3NjMxMjI3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

const statusColors = {
  Aktiv: 'bg-green-50 text-green-700 border-green-200',
  Entwurf: 'bg-gray-50 text-gray-700 border-gray-200',
  Storniert: 'bg-red-50 text-red-700 border-red-200',
  Verkauft: 'bg-blue-50 text-blue-700 border-blue-200'
};

export function ListingsManagement() {
  const [selectedListings, setSelectedListings] = useState<number[]>([]);

  const toggleSelection = (id: number) => {
    setSelectedListings(prev =>
      prev.includes(id) ? prev.filter(listingId => listingId !== id) : [...prev, id]
    );
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-[#3a3735]"
          style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}
        >
          Meine Inserate
        </h2>
        <button className="bg-[#3a3735] hover:bg-[#c8a882] text-[#faf8f4] hover:text-[#3a3735] px-6 py-3 transition-colors tracking-wide">
          Neues Inserat erstellen
        </button>
      </div>

      {selectedListings.length > 0 && (
        <div className="bg-[#f5f1ea] p-4 mb-6 flex items-center justify-between">
          <p className="text-[#3a3735]">{selectedListings.length} Element(e) ausgewählt</p>
          <div className="flex gap-3">
            <button className="text-[#3a3735] hover:text-[#c8a882] text-sm tracking-wide border border-[#3a3735] hover:border-[#c8a882] px-4 py-2 transition-colors">
              Status ändern
            </button>
            <button className="text-[#3a3735] hover:text-[#c8a882] text-sm tracking-wide border border-[#3a3735] hover:border-[#c8a882] px-4 py-2 transition-colors">
              Ausgewählte löschen
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white p-6 shadow-md hover:shadow-lg transition-all border border-[#e8dfd0]"
          >
            <div className="flex items-start gap-6">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedListings.includes(listing.id)}
                onChange={() => toggleSelection(listing.id)}
                className="mt-2 w-4 h-4 accent-[#c8a882]"
              />

              {/* Image */}
              <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-[#e8dfd0]">
                <Image
                  width={300}
                  height={300}
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3
                      className="text-[#3a3735] mb-2"
                      style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem' }}
                    >
                      {listing.title}
                    </h3>
                    <p className="text-[#c8a882] mb-2">
                      ${listing.price.toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs tracking-wider border ${statusColors[listing.status]}`}>
                    {listing.status}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-sm text-[#5a524b] mb-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                    <span>{listing.views.toLocaleString()} Aufrufe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gavel className="w-4 h-4" strokeWidth={1.5} />
                    <span>{listing.bids} Gebote</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" strokeWidth={1.5} />
                    <span>{listing.timeRemaining}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 text-[#3a3735] hover:text-[#c8a882] text-sm transition-colors">
                    <Edit className="w-4 h-4" strokeWidth={1.5} />
                    Bearbeiten
                  </button>
                  <button className="flex items-center gap-2 text-[#3a3735] hover:text-[#c8a882] text-sm transition-colors">
                    <TrendingUp className="w-4 h-4" strokeWidth={1.5} />
                    Boost
                  </button>
                  <button className="flex items-center gap-2 text-[#3a3735] hover:text-[#c8a882] text-sm transition-colors">
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                    Statistiken
                  </button>
                  <button className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm transition-colors">
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    Löschen
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
