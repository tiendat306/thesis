import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Globe, MessageSquare, Send, PlayCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white pt-20 pb-10 dark:bg-black border-t border-zinc-100 dark:border-zinc-900">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-6">
            <Link href="/" className="relative h-15 w-37">
              <Image
                src="/logo.png"
                alt="SneakFreak"
                fill
                className="object-contain"
              />
            </Link>
            <p className="text-zinc-500 leading-relaxed">
              Your ultimate destination for the latest and most exclusive sneakers.
              Elevate your street style with SneakFreak.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-full hover:bg-orange-500 hover:text-white transition-all">
                <Globe size={18} />
              </a>
              <a href="#" className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-full hover:bg-orange-500 hover:text-white transition-all">
                <MessageSquare size={18} />
              </a>
              <a href="#" className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-full hover:bg-orange-500 hover:text-white transition-all">
                <Send size={18} />
              </a>
              <a href="#" className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-full hover:bg-orange-500 hover:text-white transition-all">
                <PlayCircle size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-black uppercase tracking-widest">Shop</h4>
            <ul className="flex flex-col gap-4 text-zinc-500">
              <li><Link href="/products" className="hover:text-orange-500 transition-colors">All Sneakers</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-orange-500 transition-colors">New Arrivals</Link></li>
              <li><Link href="/sale" className="hover:text-orange-500 transition-colors">Sale</Link></li>
              <li><Link href="/brands" className="hover:text-orange-500 transition-colors">Brands</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-black uppercase tracking-widest">Support</h4>
            <ul className="flex flex-col gap-4 text-zinc-500">
              <li><Link href="/shipping" className="hover:text-orange-500 transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-orange-500 transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="hover:text-orange-500 transition-colors">FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-black uppercase tracking-widest">Newsletter</h4>
            <p className="mb-4 text-zinc-500">Join our mailing list to get updates on the latest drops.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-l-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <button className="bg-orange-600 text-white px-6 py-3 rounded-r-xl font-bold hover:bg-orange-500 transition-all">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-500 text-sm italic">
            &copy; 2026 SneakFreak. All rights reserved. Built with passion for sneakers.
          </p>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <Link href="/terms" className="hover:text-zinc-950 dark:hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-zinc-950 dark:hover:text-white">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
