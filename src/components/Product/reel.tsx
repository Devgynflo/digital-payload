"use client";

import { TQueryValidator } from "@/lib/validators/query-validator";
import { Product } from "@/payload/payload.types";
import { trpc } from "@/trpc/client";
import { NextPage } from "next";
import Link from "next/link";
import { ProductListing } from "./listing";

interface ProductReelProps {
  title: string;
  subtitle?: string;
  href?: string;
  query: TQueryValidator;
}

export const ProductReel: NextPage<ProductReelProps> = ({
  title,
  subtitle,
  href,
  query,
}) => {
  const FALLBACK_LIMIT = 4;
  const { data: queryResults, isLoading } =
    trpc.getInfiniteProducts.useInfiniteQuery(
      {
        limit: query.limit ?? FALLBACK_LIMIT,
        query,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
      },
    );

  const products = queryResults?.pages.flatMap((page) => page.items);

  let map: (Product | null)[] = [];
  if (products && products.length) {
    map = products;
  } else if (isLoading) {
    map = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null);
  }

  return (
    <section className="py-12">
      <div className="mb-4 md:flex md:items-center md:justify-between">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          {title && (
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {href && (
          <Link
            href={href}
            className="hidden text-sm font-bold text-blue-500 hover:text-blue-600 md:block"
          >
            Parcourir{" "}
            <span aria-hidden="true" className="text-base">
              &rarr;
            </span>
          </Link>
        )}
      </div>

      <div className="relative">
        <div className="mt-6 flex w-full items-center">
          <div className="grid w-full grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:gap-x-8">
            {map.map((product, i) => (
              <ProductListing
                key={product?.id || i}
                product={product}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
