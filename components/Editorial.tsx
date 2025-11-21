"use client";
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export function Editorial() {
  return (
    <section className="py-32 bg-[#faf8f4]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="aspect-3/4 overflow-hidden shadow-2xl">
                <Image
                fill
                  src="https://images.unsplash.com/photo-1758887263106-48f9934c1cdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoZXJpdGFnZSUyMGNyYWZ0c21hbnNoaXB8ZW58MXx8fHwxNzYzMTIyNzQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Heritage craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-8 -right-8 w-48 h-48 border border-[#c8a882] -z-10"></div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-12 bg-[#c8a882]"></div>
              <span className="text-[#c8a882] text-sm tracking-[0.2em] uppercase">
                Our Story
              </span>
            </div>

            <h2 
              className="text-[#3a3735] mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Provenance & Heritage
            </h2>

            <div className="space-y-6 text-[#5a524b] leading-relaxed mb-8">
              <p>
                At Lumière, we believe that every extraordinary object carries within it a story—
                a narrative of artistry, innovation, and the passage of time. Our auctions are 
                curated with meticulous care to present only the finest examples of human 
                achievement across centuries and cultures.
              </p>
              
              <p>
                From rare timepieces crafted by master horologists to museum-quality artworks 
                and antiquities, each lot in our collection has been authenticated by leading 
                experts and comes with comprehensive provenance documentation.
              </p>

              <p>
                We invite discerning collectors to discover pieces that transcend mere ownership—
                treasures that become part of your legacy and continue their journey through time.
              </p>
            </div>

            <button className="group flex items-center gap-3 text-[#3a3735] hover:text-[#c8a882] transition-colors">
              <span className="tracking-wide">Learn More About Our Process</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
            </button>

            {/* Stats */}
            <div className="mt-12 pt-12 border-t border-[#d4cec4] grid grid-cols-3 gap-8">
              <div>
                <div 
                  className="text-[#c8a882] mb-2"
                  style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}
                >
                  25+
                </div>
                <p className="text-[#5a524b] text-sm">Years of Excellence</p>
              </div>
              <div>
                <div 
                  className="text-[#c8a882] mb-2"
                  style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}
                >
                  $2.4B
                </div>
                <p className="text-[#5a524b] text-sm">Total Sales</p>
              </div>
              <div>
                <div 
                  className="text-[#c8a882] mb-2"
                  style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}
                >
                  98%
                </div>
                <p className="text-[#5a524b] text-sm">Client Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
