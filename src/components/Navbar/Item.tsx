"use client";

import { NextPage } from "next";
import { Button } from "../ui/button";
import { PRODUCT_CATEGORIES } from "@/config";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type Category = (typeof PRODUCT_CATEGORIES)[number];

interface ItemProps {
  category: Category;
  handleOpen: () => void;
  isOpen: boolean;
  isAnyOpen: boolean;
}

export const NavItem: NextPage<ItemProps> = ({
  category,
  handleOpen,
  isAnyOpen,
  isOpen,
}) => {
  return (
    <div className="flex">
      <div className="relative flex items-center">
        <Button
          className="gap-1.5"
          onClick={handleOpen}
          variant={isOpen ? "secondary" : "ghost"}
        >
          {category.label}
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-all",
              isOpen && "-rotate-180",
            )}
          />
        </Button>
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute inset-x-0 top-full text-sm text-muted-foreground",
            !isAnyOpen && "animate-in fade-in-10 slide-in-from-top-5",
          )}
        >
          <div
            className="absolute inset-0 top-1/2 bg-white shadow"
            aria-hidden
          />
          <div className="relative bg-white">
            <div className="mx-auto max-w-7xl px-8">
              <div className="grid grid-cols-4 gap-x-8 gap-y-10 py-16">
                <div className="col-span-4 col-start-1 grid grid-cols-3 gap-8">
                  {category.featured.map((item) => (
                    <div
                      className="group relative text-base sm:text-sm"
                      key={item.name}
                    >
                      <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                        <Image
                          priority
                          sizes="100%"
                          src={item.imageSrc}
                          alt={item.name}
                          fill
                          className="object-cover object-center"
                        />
                      </div>

                      <div>
                        <Link
                          href={item.href}
                          className="mt-6 block font-medium text-gray-900"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1" aria-hidden>
                          Shop Now
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
