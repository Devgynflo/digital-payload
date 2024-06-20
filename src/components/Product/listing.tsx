"use client";

import { Product } from "@/payload/payload.types";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { ProductPlaceholder } from "./placeholder";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/config";
import { ImageSlider } from "./image-slider";

interface ProductListingProps {
  product: Product | null;
  index: number;
}

export const ProductListing: NextPage<ProductListingProps> = ({
  product,
  index,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  // Utils
  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product?.category,
  )?.label;

  const validUrls = product?.images
    .map(({ image }) => (typeof image === "string" ? image : image.url))
    .filter(Boolean) as string[];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);

    return () => clearTimeout(timer);
  }, [index]);

  if (!product || !isVisible) return <ProductPlaceholder />;

  if (isVisible && product) {
    return (
      <Link
        className={cn(
          "group/main invisible h-full w-full cursor-pointer",
          isVisible && "visible animate-in fade-in-5",
        )}
        href={`/product/${product.id}`}
      >
        <div className="flex w-full flex-col">
          <ImageSlider urls={validUrls} />
          <h3 className="mt-4 font-medium text-gray-700">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{label}</p>
          <p className="tex-sm mt-1 font-medium text-gray-900">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    );
  }
};
