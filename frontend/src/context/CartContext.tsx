import React, { createContext, useContext, useState, ReactNode } from "react";
import type { CartItem, StoreSlug } from "../types";

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  storeSlug: StoreSlug | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  setStoreSlug: (slug: StoreSlug) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [storeSlug, setStoreSlugState] = useState<StoreSlug | null>(null);

  const setStoreSlug = (slug: StoreSlug) => {
    if (storeSlug && storeSlug !== slug) {
      setItems([]);
    }
    setStoreSlugState(slug);
  };

  const addItem = (item: CartItem) => {
    if (!storeSlug) {
      setStoreSlug(item.storeSlug);
    } else if (storeSlug !== item.storeSlug) {
      setStoreSlug(item.storeSlug);
      setItems([]);
    }

    setItems((prev) => {
      const existing = prev.find(
        (p) => p.productId === item.productId && p.storeSlug === item.storeSlug
      );
      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId && p.storeSlug === item.storeSlug
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((p) => p.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value: CartContextValue = {
    items,
    totalItems,
    totalPrice,
    storeSlug,
    addItem,
    removeItem,
    clearCart,
    setStoreSlug
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};
