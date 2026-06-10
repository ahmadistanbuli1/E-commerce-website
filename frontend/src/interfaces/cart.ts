import type { Product } from "./catalog";

export type CartItem = {
  id: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  product: Product;
};

export type Cart = {
  id: string;
  userId: string;
  updatedAt: string;
  items: CartItem[];
  total: string;
};

