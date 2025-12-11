export type StoreSlug = "parnavaz" | "konstantine";

export interface Store {
  _id: string;
  name: string;
  slug: StoreSlug;
  address: string;
  phone?: string;
  workTime?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string | null;
  basePrice: number;
  unit: string;
  imageName?: string;
  inStock: number;
  price: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  storeSlug: StoreSlug;
}
