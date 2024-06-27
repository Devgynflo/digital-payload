import { Product } from "@/payload/payload.types";
import update from "payload/dist/collections/operations/update";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ExtProduct extends Product {
  count: number;
}

export type CartItem = {
  product: ExtProduct;
};

type CartState = {
  items: ExtProduct[];
  count: () => number;
  totalPrice: () => number;
  addItem: (product: Product) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setItemCount: (id: string, count: number) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      count: (): number => {
        const { items } = get();
        if (items.length) {
          return items.reduce((sum, item) => sum + item.count, 0);
          // ~ return items.map((item) => item.count).reduce((a, b) => a + b);
        }
        return 0;
      },
      addItem: (product) => {
        const { items } = get();
        const updatedCart = addToCart(items, product);
        set({ items: updatedCart });
      },
      incrementItem: (id) => {
        const { items } = get();
        const updatedCart = incrementInCart(items, id);
        set({ items: updatedCart });
      },
      decrementItem: (id) => {
        const { items } = get();
        const updatedCart = decrementInCart(items, id);
        set({ items: updatedCart });
      },
      removeItem: (id) => {
        const { items } = get();
        const updatedCart = removeFromCart(items, id);
        set({ items: updatedCart });
      },
      clearCart: () => set({ items: [] }),
      totalPrice: () => {
        const { items } = get();
        if (items.length) {
          return items.reduce((total, product) => {
            return (total += product.price * product.count);
          }, 0);
        }
        return 0;
      },
      setItemCount: (id, count) => {
        const { items } = get();
        const updatedCart = setCountInCart(items, id, count);
        set({
          items: updatedCart,
        });
      },
    }),

    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

const addToCart = (carts: ExtProduct[], product: Product): ExtProduct[] => {
  const item = carts.find((item) => item.id === product.id);

  if (item) {
    return carts.map((item) => {
      if (item.id === product.id) {
        const itemCount = item.count >= 1 ? item.count : 1;
        return { ...item, count: itemCount };
      }
      return item;
    });
  }

  return [...carts, { ...product, count: 1 }];
};

const incrementInCart = (carts: ExtProduct[], id: string) => {
  const item = carts.find((item) => item.id === id);
  if (item) {
    return carts.map((item) => {
      if (item.id === id) {
        return { ...item, count: item.count + 1 };
      }
      return item;
    });
  }
  return carts;
};

const decrementInCart = (carts: ExtProduct[], id: string): ExtProduct[] => {
  const item = carts.find((item) => item.id === id);

  if (item) {
    return carts.map((item) => {
      if (item.id === id) {
        const itemCount = item.count > 1 ? item.count - 1 : 1;
        return { ...item, count: itemCount };
      }
      return item;
    });
  }

  return carts;
};

const removeFromCart = (carts: ExtProduct[], id: string): ExtProduct[] => {
  const item = carts.find((item) => item.id === id);

  if (item) {
    return carts.filter((item) => item.id !== id);
  }

  return carts;
};

const setCountInCart = (
  carts: ExtProduct[],
  id: string,
  count: number,
): ExtProduct[] => {
  const item = carts.find((item) => item.id === id);
  if (item) {
    return carts.map((item) => {
      if (item.id === id) {
        const itemCount = count >= 1 ? count : 1;
        return { ...item, count: itemCount };
      }
      return item;
    });
  }
  return carts;
};
