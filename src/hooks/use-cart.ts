import { Product } from "@/payload/payload.types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
export type CartItem = {
  product: Product;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((slate) => ({ items: [...slate.items, { product }] })),
      removeItem: (id) =>
        set((slate) => ({
          items: slate.items.filter((item) => item.product.id !== id),
        })),
      clearCart: () => set({ items: [] }),
    }),

    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
