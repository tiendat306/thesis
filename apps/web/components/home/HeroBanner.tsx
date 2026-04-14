'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Shoe3D } from './Shoe3D';

const SNEAKERS = [
  {
    id: 'balmain',
    name: 'Balmain Unicorn',
    subtitle: 'Low-Top Sneakers',
    description: 'An architectural masterpiece. The Balmain Unicorn features a multi-sectional sole, aerodynamic lines, and a futuristic lion-head emblem.',
    modelUrl: '/models/balmain_unicorn_low-top.glb',
    scale: 0.3,
    color: 'from-zinc-400 to-zinc-900',
    accent: 'text-zinc-400',
  },
  {
    id: 'nike',
    name: 'Nike Dunk Low',
    subtitle: 'UNLV Edition',
    description: 'A classic silhouette reborn. The Dunk Low UNLV brings varsity colors to the streets with premium leather and iconic blocking.',
    modelUrl: '/models/nike_dunk_low_unlv.glb',
    scale: 0.3,
    brightness: 1.05,
    color: 'from-red-600 to-zinc-600',
    accent: 'text-red-500',
  },
  {
    id: 'hawaii',
    name: 'Nike Dunk High',
    subtitle: 'SB Maui Wowie',
    description: 'Island vibes captured. The "Hawaii" SB Dunk High features a tear-away floral print revealing rugged suede and beach-inspired textures.',
    modelUrl: '/models/nike_dunk_high_sb_hawaii.glb',
    scale: 0.3,
    brightness: 1.5,
    color: 'from-cyan-600 to-indigo-600',
    accent: 'text-cyan-500',
  },
];

export const HeroBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentShoe = SNEAKERS[currentIndex];

  const nextShoe = () => {
    setCurrentIndex((prev) => (prev + 1) % SNEAKERS.length);
  };

  const prevShoe = () => {
    setCurrentIndex((prev) => (prev - 1 + SNEAKERS.length) % SNEAKERS.length);
  };

  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 text-[0]">
        <Image
          src="/banner_bg_web.png"
          alt="Banner Background"
          fill
          className="object-cover opacity-80"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
      </div>

      {/* Navigation - Corner Buttons */}
      <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-between px-6 md:px-12">
        <button
          onClick={prevShoe}
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white transition-all hover:bg-white/10 hover:scale-110 active:scale-95 group"
        >
          <ChevronLeft size={32} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={nextShoe}
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white transition-all hover:bg-white/10 hover:scale-110 active:scale-95 group"
        >
          <ChevronRight size={32} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Pedestal & 3D Scene - Centered */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="relative h-[500px] w-[500px] flex items-center justify-center">
          {/* 3D Shoe Canvas (Interactive) */}
          <div className="absolute inset-0 pointer-events-auto h-[600px] w-[600px] -translate-y-[15%]">
            <Suspense fallback={
              <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="animate-spin text-white/20" size={40} />
              </div>
            }>
              <Shoe3D
                key={currentShoe.id}
                modelUrl={currentShoe.modelUrl}
                scale={currentShoe.scale}
                brightness={currentShoe.brightness}
              />
            </Suspense>
          </div>

          {/* Pagination Indicators */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-auto">
            {SNEAKERS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 transition-all duration-300 rounded-full ${index === currentIndex ? 'w-8 bg-orange-500' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content - Centered Text Overlay */}
      <div className="container relative z-30 mx-auto flex h-full flex-col items-center justify-center px-6 text-center pointer-events-none">
        <div className="max-w-4xl">
          <div className="mb-4 flex items-center justify-center gap-2 pointer-events-auto">
            <span className="h-px w-8 bg-orange-500" />
            <span className="text-sm font-bold uppercase tracking-[0.4em] text-orange-500">
              {currentShoe.subtitle}
            </span>
            <span className="h-px w-8 bg-orange-500" />
          </div>

          <h1 className="mb-32 md:mb-48 text-5xl sm:text-7xl md:text-9xl font-black uppercase italic tracking-tighter text-white leading-[0.8] opacity-90 drop-shadow-2xl pointer-events-none transition-all duration-700">
            {currentShoe.name.split(' ').slice(0, -1).join(' ')} <br />
            <span className={`bg-gradient-to-r ${currentShoe.color} bg-clip-text text-transparent`}>
              {currentShoe.name.split(' ').pop()}
            </span>
          </h1>

          <div className="flex flex-col items-center gap-8 mt-12 pointer-events-auto">
            <p className="max-w-lg text-lg text-zinc-300 drop-shadow-md">
              {currentShoe.description}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="group flex items-center gap-2 rounded-full bg-orange-600 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-orange-500 hover:shadow-[0_0_30px_rgba(234,88,12,0.4)]"
              >
                Shop Now
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <button className="group flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/10">
                <Play size={12} fill="currentColor" />
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Instructions */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-white/30 text-[10px] font-bold uppercase tracking-[0.5em] z-40">
        <span className="animate-bounce">↓</span> Experience 3D <span className="animate-bounce">↓</span>
      </div>
    </section>
  );
};
