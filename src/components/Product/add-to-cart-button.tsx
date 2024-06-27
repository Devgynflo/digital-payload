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
  const { addItem, incrementItem } = useCart();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const { items } = useCart();

  const isInCart = items.some((item) => item.id === product.id);

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
    if (isInCart) {
      incrementItem(product.id);
    }
    addItem(product);
  }

  return (
    <Button
      size={"lg"}
      className="w-full"
      disabled={isSuccess}
      onClick={handleClick}
    >
      {isSuccess ? "Rajouté" : "Ajouter"}
    </Button>
  );
};
