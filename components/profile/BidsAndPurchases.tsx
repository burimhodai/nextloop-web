import { TrendingUp, TrendingDown, Clock, Package, Star, Download } from 'lucide-react';
import Image from 'next/image';

interface Bid {
  id: number;
  title: string;
  currentBid: number;
  yourMaxBid: number;
  status: 'Leading' | 'Outbid';
  timeRemaining: string;
  image: string;
}

interface WonAuction {
  id: number;
  title: string;
  price: number;
  paymentStatus: 'Paid' | 'Pending';
  shippingStatus: 'Shipped' | 'Processing' | 'Delivered';
  trackingNumber?: string;
  image: string;
}

const activeBids: Bid[] = [
  {
    id: 1,
    title: "Vintage Ferrari 250 GTO 1962",
    currentBid: 4500000,
    yourMaxBid: 4600000,
    status: "Leading",
    timeRemaining: "1 day",
    image: "https://images.unsplash.com/photo-1628832908835-814f799db7c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbHV4dXJ5JTIwY2FyfGVufDF8fHx8MTc2MzEyMjc0Nnww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 2,
    title: "Diamond Rivière Necklace",
    currentBid: 325000,
    yourMaxBid: 320000,
    status: "Outbid",
    timeRemaining: "5 hours",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwZGlhbW9uZHxlbnwxfHx8fDE3NjMwNDM5OTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

const wonAuctions: WonAuction[] = [
  {
    id: 1,
    title: "Hellenistic Marble Torso",
    price: 425000,
    paymentStatus: "Paid",
    shippingStatus: "Shipped",
    trackingNumber: "1Z999AA10123456784",
    image: "https://images.unsplash.com/photo-1628508438706-6e6a19853e1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwc2N1bHB0dXJlJTIwbWFyYmxlfGVufDF8fHx8MTc2MzEyMjc0N3ww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 2,
    title: "Post-Impressionist Landscape",
    price: 780000,
    paymentStatus: "Paid",
    shippingStatus: "Delivered",
    image: "https://images.unsplash.com/photo-1637578035851-c5b169722de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwYXJ0JTIwcGFpbnRpbmd8ZW58MXx8fHwxNzYzMDI5MDczfDA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

export function BidsAndPurchases() {
  return (
    <div className="mb-12">
      {/* Active Bids */}
      <div className="mb-10">
        <h2
          className="text-[#3a3735] mb-6"
          style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}
        >
          Aktive Gebote
        </h2>

        <div className="space-y-4">
          {activeBids.map((bid) => (
            <div
              key={bid.id}
              className="bg-white p-6 shadow-md hover:shadow-lg transition-all border border-[#e8dfd0]"
            >
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-[#e8dfd0]">
                  <Image
                    width={300}
                    height={300}
                    src={bid.image}
                    alt={bid.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="text-[#3a3735]"
                      style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem' }}
                    >
                      {bid.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {bid.status === 'Leading' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" strokeWidth={1.5} />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" strokeWidth={1.5} />
                      )}
                      <span className={`text-sm ${bid.status === 'Leading' ? 'text-green-600' : 'text-red-600'}`}>
                        {bid.status === 'Leading' ? 'Führend' : 'Überboten'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-[#5a524b] mb-1">Aktuelles Gebot</p>
                      <p className="text-[#3a3735]">${bid.currentBid.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[#5a524b] mb-1">Dein Maximalgebot</p>
                      <p className="text-[#c8a882]">${bid.yourMaxBid.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[#5a524b] mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" strokeWidth={1.5} />
                        Verbleibende Zeit
                      </p>
                      <p className="text-[#3a3735]">{bid.timeRemaining}</p>
                    </div>
                  </div>

                  <button className="bg-[#3a3735] hover:bg-[#c8a882] text-[#faf8f4] hover:text-[#3a3735] px-6 py-2 text-sm transition-colors tracking-wide">
                    {bid.status === 'Leading' ? 'Gebot erhöhen' : 'Höheres Gebot abgeben'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Won Auctions */}
      <div>
        <h2
          className="text-[#3a3735] mb-6"
          style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}
        >
          Gewonnene Auktionen
        </h2>

        <div className="space-y-4">
          {wonAuctions.map((auction) => (
            <div
              key={auction.id}
              className="bg-white p-6 shadow-md hover:shadow-lg transition-all border border-[#e8dfd0]"
            >
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-[#e8dfd0]">
                  <Image
                    width={300}
                    height={300}
                    src={auction.image}
                    alt={auction.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3
                    className="text-[#3a3735] mb-3"
                    style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem' }}
                  >
                    {auction.title}
                  </h3>

                  <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-[#5a524b] mb-1">Endpreis</p>
                      <p className="text-[#c8a882]">${auction.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[#5a524b] mb-1">Zahlung</p>
                      <span className={`px-2 py-1 text-xs ${auction.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                        {auction.paymentStatus === 'Paid' ? 'Bezahlt' : 'Ausstehend'}
                      </span>
                    </div>
                    <div>
                      <p className="text-[#5a524b] mb-1">Versand</p>
                      <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700">
                        {auction.shippingStatus === 'Shipped' ? 'Versendet' : auction.shippingStatus === 'Delivered' ? 'Zugestellt' : 'In Bearbeitung'}
                      </span>
                    </div>
                    {auction.trackingNumber && (
                      <div>
                        <p className="text-[#5a524b] mb-1">Sendungsverfolgung</p>
                        <p className="text-[#3a3735] text-xs">{auction.trackingNumber}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {auction.trackingNumber && (
                      <button className="flex items-center gap-2 text-[#3a3735] hover:text-[#c8a882] text-sm transition-colors">
                        <Package className="w-4 h-4" strokeWidth={1.5} />
                        Bestellung verfolgen
                      </button>
                    )}
                    {auction.shippingStatus === 'Delivered' && (
                      <button className="flex items-center gap-2 text-[#3a3735] hover:text-[#c8a882] text-sm transition-colors">
                        <Star className="w-4 h-4" strokeWidth={1.5} />
                        Bewertung abgeben
                      </button>
                    )}
                    <button className="flex items-center gap-2 text-[#3a3735] hover:text-[#c8a882] text-sm transition-colors">
                      <Download className="w-4 h-4" strokeWidth={1.5} />
                      Rechnung herunterladen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
