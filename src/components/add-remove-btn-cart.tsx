"use client";

import { useCart } from "@/hooks/use-cart";
import { NextPage } from "next";

interface AddRemoveBtnCartProps {
  id: string;
}

export const AddRemoveBtnCart: NextPage<AddRemoveBtnCartProps> = ({ id }) => {
  const { incrementItem, decrementItem, items } = useCart();

  const qty = items.find((item) => item.id === id)?.count;

  return (
    <div className="flex w-24 items-center justify-between rounded-2xl bg-gray-50 px-2 py-1">
      <button
        disabled={false}
        onClick={() => {
          decrementItem(id);
        }}
        className="cursor-pointer text-xl"
      >
        -
      </button>
      {qty}
      <button
        disabled={false}
        className="cursor-pointer text-xl"
        onClick={() => {
          incrementItem(id);
        }}
      >
        +
      </button>
    </div>
  );
};
