"use client";

import { AddRemoveBtnCart } from "@/components/add-remove-btn-cart";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";
import { Category } from "@/payload/payload.types";
import { trpc } from "@/trpc/client";
import { Loader2, X } from "lucide-react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CartPageProps {}

const CartPage: NextPage<CartPageProps> = ({}) => {
  const router = useRouter();
  const { mutate: createCheckoutSession, isLoading } =
    trpc.payment.createSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) {
          router.push(url);
        }
      },
    });
  const { items, removeItem, totalPrice } = useCart();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  //const productIds = items.map((product) => product.id);
  const productsInCart = items.map((product) => {
    return { id: product.id, qty: product.count };
  });

  const fee = 1;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div
            className={cn(
              "lg:col-span-7",
              isMounted &&
                items.length === 0 &&
                "rounded-lg border-2 border-dashed border-zinc-200 p-12",
            )}
          >
            <h2 className="sr-only">Items in your shopping cart</h2>

            {isMounted && items.length === 0 && (
              <div className="flex flex-col items-center justify-center space-y-1">
                <div
                  className="relative mb-4 size-40 text-muted-foreground"
                  aria-hidden
                >
                  <Image
                    priority
                    src={"/hippo-empty-cart.png"}
                    alt="hippo cart empty"
                    fill
                    loading="eager"
                    sizes="100%"
                  />
                </div>
                <h3 className="text-2xl font-semibold">Your cart is empty!</h3>
                <p className="text-center text-muted-foreground">
                  Whooops! Nothing to show here yet.
                </p>
              </div>
            )}

            <ul
              className={cn(
                isMounted &&
                  items.length &&
                  "border-b- divide-y divide-gray-200 border-t border-gray-200",
              )}
            >
              {isMounted &&
                items.map((product) => {
                  const label = (product.categories[0] as Category).name;

                  const { image } = product.images[0];

                  return (
                    <li className="flex py-6 sm:py-10" key={product.id}>
                      <div className="flex-shrink-0">
                        <div className="relative size-24">
                          {typeof image !== "string" && image.url && (
                            <Image
                              priority
                              sizes="100%"
                              loading="eager"
                              src={image.url}
                              alt="product image"
                              fill
                              className="size-full rounded-md object-cover object-center sm:size-48"
                            />
                          )}
                        </div>
                      </div>

                      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div className="">
                            <div className="flex justify-between">
                              <h3 className="text-sm">
                                <Link
                                  href={`/product/${product.slug}`}
                                  className="font-medium text-gray-700 hover:text-gray-800"
                                >
                                  {product.name}
                                </Link>
                              </h3>
                            </div>

                            <div className="mt-1 flex text-sm">
                              <p className="text-muted-foreground">
                                Category: {label}
                              </p>
                            </div>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {formatPrice(product.price)}
                            </p>
                          </div>

                          <div className="mt-4 w-20 sm:mt-0 sm:pr-9">
                            <div className="absolute right-0 top-0">
                              <Button
                                className="text-red-500"
                                variant={"ghost"}
                                aria-label="remove product"
                                onClick={() => {
                                  removeItem(product.id);
                                }}
                              >
                                <X aria-hidden className="size-5" />
                              </Button>
                              <AddRemoveBtnCart id={product.id} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>

          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="tes-gray-600 text-sm">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(totalPrice())
                  ) : (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-400 pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Flat transaction Fee</span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(fee)
                  ) : (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-base font-medium text-gray-900">
                  Order Total
                </div>
                <div className="text-base font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(fee + totalPrice())
                  ) : (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                disabled={!items.length || isLoading}
                className="w-full"
                size={"lg"}
                onClick={() => createCheckoutSession({ productsInCart })}
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                ) : (
                  "Checkout"
                )}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
