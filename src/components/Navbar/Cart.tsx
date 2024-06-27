"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";

import { NextPage } from "next";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "./cart-item";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CartProps {}

export const Cart: NextPage<CartProps> = ({}) => {
  const { items, count, totalPrice } = useCart();
  const fee = 1;
  const cartTotal = items.reduce((acc, item) => {
    return (acc += item.price);
  }, 0);

  return (
    <Sheet>
      <SheetTrigger className="group -m-2 flex items-center p-2">
        <ShoppingCart
          className="size-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
          aria-hidden
        />
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {items.length ? count() : ""}
        </span>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Panier</SheetTitle>
        </SheetHeader>

        {items.length > 0 ? (
          <>
            <div className="flex w-full flex-col pr-6">
              <ScrollArea>
                {items.map((product, i) => (
                  <CartItem key={i} product={product} />
                ))}
              </ScrollArea>
            </div>
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5 pr-6 text-sm">
                <div className="flex">
                  <span className="flex-1">Frais d&apos;envoi</span>
                  <span>Gratuit</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>{formatPrice(totalPrice() + fee)}</span>
                </div>
              </div>

              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    className={buttonVariants({ className: "w-full" })}
                    href={"/cart"}
                  >
                    Commander
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div
              className="relative mb-4 size-60 text-muted-foreground"
              aria-hidden
            >
              <Image
                sizes="100%"
                src={"/hippo-empty-cart.png"}
                fill
                alt="empty shopping cart hippo"
              />
            </div>
            <div className="text-xl font-semibold">Votre panier est vide.</div>
            <SheetTrigger asChild>
              <Link
                className={buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: "text-sm text-muted-foreground",
                })}
                href={"/products"}
              >
                Ajoutez des produits à votre panier.
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
