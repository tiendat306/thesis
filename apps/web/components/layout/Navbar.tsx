'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white/80 py-3 shadow-lg backdrop-blur-md dark:bg-black/80'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative h-12 w-24">
            <Image
              src="/logo.png"
              alt="SneakFreak"
              fill
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/products" className="text-sm font-bold uppercase tracking-widest hover:text-orange-500 transition-colors">Shop</Link>
            <Link href="/new-arrivals" className="text-sm font-bold uppercase tracking-widest hover:text-orange-500 transition-colors">New Arrivals</Link>
            <Link href="/brands" className="text-sm font-bold uppercase tracking-widest hover:text-orange-500 transition-colors">Brands</Link>
            <Link href="/sale" className="text-sm font-bold uppercase tracking-widest text-rose-500 transition-colors">Sale</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-orange-50 dark:hover:bg-zinc-900 rounded-full transition-colors">
              <Search size={22} />
            </button>
            <button className="p-2 hover:bg-orange-50 dark:hover:bg-zinc-900 rounded-full transition-colors">
              <User size={22} />
            </button>
            <button className="group relative p-2 hover:bg-orange-50 dark:hover:bg-zinc-900 rounded-full transition-colors">
              <ShoppingBag size={22} />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white shadow-lg group-hover:scale-110 transition-transform">
                0
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "absolute top-full left-0 w-full bg-white dark:bg-black border-t border-zinc-100 dark:border-zinc-800 transition-all duration-300 md:hidden overflow-hidden",
        isMobileMenuOpen ? "h-64 shadow-2xl" : "h-0"
      )}>
        <div className="flex flex-col p-6 gap-4">
          <Link href="/products" className="text-lg font-bold">Shop</Link>
          <Link href="/new-arrivals" className="text-lg font-bold">New Arrivals</Link>
          <Link href="/brands" className="text-lg font-bold">Brands</Link>
          <Link href="/sale" className="text-lg font-bold text-rose-500">Sale</Link>
        </div>
      </div>
    </nav>
  );
};
