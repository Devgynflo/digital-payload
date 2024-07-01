import type { AfterChangeHook } from "payload/dist/collections/config/types";

import type { Order, Product } from "@/payload/payload.types";

export const updateProductQuantity: AfterChangeHook<Order> = async ({
  doc,
  req,
  operation,
}) => {
  const { payload } = req;

  if (operation === "create" || operation === "update") {
    if (doc.items) {
      doc.items.forEach(async (item) => {
        if (typeof item.product === "string") {
          return;
        }

        await payload.update({
          collection: "products",
          id: item.product.id,
          data: {
            quantity: item.product.quantity - item.quantity!,
            outOfStock:
              item.product.quantity - item.quantity! <= 0
                ? "_isTrue"
                : "_isFalse",
          },
        });
      });
    }
  }

  return;
};
