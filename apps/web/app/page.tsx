import { HeroBanner } from "@/components/home/HeroBanner";
import { fetchApi } from "@/lib/api";
import { Category, PaginatedResponse, Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default async function Home() {
  const categories = await fetchApi<Category[]>('/categories/tree');
  const productsResponse = await fetchApi<PaginatedResponse<Product>>('/products?limit=4');

  return (
    <div className="flex flex-col gap-20 pb-20">
      <HeroBanner />

      {/* Featured Categories */}
      <section className="container mx-auto px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Shop by Category</h2>
            <p className="text-zinc-500">Discover your style with our curated collections.</p>
          </div>
          <Link href="/products" className="group flex items-center gap-2 font-bold uppercase tracking-widest text-orange-500">
            View All
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 3).map((cat, index) => (
            <Link 
              key={cat.id} 
              href={`/products?categoryId=${cat.id}`}
              className="group relative h-80 overflow-hidden rounded-3xl bg-zinc-200"
            >
              {cat.image ? (
                <Image 
                  src={cat.image} 
                  alt={cat.name} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-110" 
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
              <div className="absolute bottom-8 left-8">
                <p className="mb-1 text-sm font-bold uppercase tracking-widest text-orange-400">0{index + 1}</p>
                <h3 className="text-3xl font-black uppercase italic tracking-tight text-white">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-zinc-100 py-20 dark:bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center text-orange-600">
            <Zap size={40} className="mx-auto mb-4 animate-pulse fill-current" />
            <h2 className="text-5xl font-black uppercase italic tracking-tighter text-zinc-950 dark:text-white">
              Hot Releases
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {productsResponse.data.map((product) => (
              <Link 
                key={product.id} 
                href={`/products/${product.slug}`}
                className="group flex flex-col gap-4"
              >
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-white p-8 dark:bg-zinc-900">
                  <Image 
                    src={product.colors[0]?.images[0]?.url || "/placeholder.png"} 
                    alt={product.name}
                    fill
                    className="object-contain p-8 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                  />
                  {product.isFeatured && (
                    <span className="absolute top-4 left-4 rounded-full bg-orange-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                      Featured
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">{product.brand.name}</p>
                  <h3 className="text-lg font-bold transition-colors group-hover:text-orange-500">{product.name}</h3>
                  <p className="text-xl font-black">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.basePrice)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

