"use client";

import { NextPage } from "next";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/payload/payload.types";

interface AddToCartButtonProps {
  product: Product;
}

export const AddToCartButton: NextPage<AddToCartButtonProps> = ({
  product,
}) => {
  const { addItem } = useCart();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const { items } = useCart();

  const isInCart = items.some(({ product: item }) => item.id === product.id);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isSuccess]);

  function handleClick() {
    setIsSuccess(true);
    addItem(product);
  }

  return (
    <Button
      size={"lg"}
      className="w-full"
      disabled={isSuccess || isInCart}
      onClick={handleClick}
    >
      {isSuccess ? "Added" : "Add to Cart"}
    </Button>
  );
};
