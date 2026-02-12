"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="relative h-[100dvh] flex flex-col items-center justify-center bg-gradient-to-b from-[#faf8f4] to-[#f5f1ea] overflow-hidden">
            {/* Mountain backgrounds */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Left mountain */}
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

                {/* Right mountain */}
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

            {/* Content */}
            <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
                <h1
                    className="text-6xl md:text-8xl text-[#3a3735] mb-6 leading-[1.1]"
                    style={{ fontFamily: "Playfair Display, serif" }}
                >
                    404
                </h1>

                <h2
                    className="text-3xl md:text-4xl text-[#3a3735] mb-6 leading-[1.1]"
                    style={{ fontFamily: "Playfair Display, serif" }}
                >
                    Hoppla! Da isch nüt.
                </h2>

                <p className="text-lg text-[#5a524b] leading-relaxed max-w-lg mx-auto mb-10">
                    Die Siite, wo du suechsch, gits leider nöd oder isch verschobe worde.
                    Vellicht hesch di vertippt?
                </p>

                {/* Changed Link to Button for router.back() */}
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-block bg-[#3a3735] text-white px-8 py-4 text-sm tracking-wider uppercase font-medium transition-all hover:bg-[#c8a882] shadow-sm hover:shadow-md cursor-pointer"
                >
                    Zrugg gah
                </button>
            </div>
        </div>
    );
}