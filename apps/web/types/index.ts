export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  parentId?: string;
  children?: Category[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  colorId: string;
  size: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
}

export interface ProductColor {
  id: string;
  productId: string;
  name: string;
  colorCode?: string;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  brand: Brand;
  category: Category;
  colors: ProductColor[];
  isFeatured: boolean;
  avgRating: number;
  totalSold: number;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
