import { z } from "zod";
import { privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../payload/get-payload-client";
import { stripe } from "../lib/stripe";
import type Stripe from "stripe";

export const paymentRouter = router({
  createSession: privateProcedure
    //.input(z.object({ productIds: z.array(z.string()) }))
    .input(
      z.object({
        productsInCart: z.array(z.object({ id: z.string(), qty: z.number() })),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      //let { productIds } = input;
      let { productsInCart } = input;

      const productIds = productsInCart.map((item) => item.id);
      //const productIds = ["667bc02a0bfaa70285604b74"];

      if (!productIds.length) throw new TRPCError({ code: "BAD_REQUEST" });

      const payload = await getPayloadClient();

      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: {
            in: productIds,
          },
        },
      });

      const totalOrder = productsInCart.reduce((total, item) => {
        products.forEach((product) => {
          if (product.id === item.id) total += product.price * item.qty;
        });
        return total;
      }, 0);

      const filteredProducts = products.filter((product) =>
        Boolean(product.priceId),
      );

      const productsInCartWithQuantity = filteredProducts.map((item) => {
        const quantityPerProduct = productsInCart.find(
          (i) => i.id === item.id,
        )?.qty;

        return {
          product: item.id,
          price: item.price,
          quantity: quantityPerProduct,
        };
      });

      const order = await payload.create({
        collection: "orders",
        data: {
          user: user.id,
          is_paid: false,
          products: filteredProducts.map((item) => item.id),
          total: totalOrder,
          items: productsInCartWithQuantity,
        },
      });

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      filteredProducts.forEach((product) => {
        line_items.push({
          price: product.priceId!,
          quantity: productsInCart.find((item) => item.id === product.id)?.qty, //1,
        });
      });

      line_items.push({
        price: process.env.STRIPE_PRODUCT_TRANSACTION_FEE as string,
        quantity: 1,
        adjustable_quantity: {
          enabled: false,
        },
      });
      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          shipping_address_collection: {
            allowed_countries: ["FR"],
          },
          payment_method_types: ["card", "paypal"],
          mode: "payment",
          metadata: {
            userId: user.id,
            orderId: order.id,
          },
          line_items,
        });

        return {
          url: stripeSession.url,
        };
      } catch (error) {
        console.log(error);
        return {
          url: null,
        };
      }
    }),
  pollOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const { orderId } = input;

      const payload = await getPayloadClient();
      const { docs: orders } = await payload.find({
        collection: "orders",
        where: {
          id: {
            equals: orderId,
          },
        },
      });

      if (!orders.length) throw new TRPCError({ code: "NOT_FOUND" });

      const [order] = orders;

      return { isPaid: order.is_paid };
    }),
});
