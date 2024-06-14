"use client";

import { PRODUCT_CATEGORIES } from "@/config";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { NavItem } from "./Item";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

interface NavItemsProps {}

export const NavItems: NextPage<NavItemsProps> = ({}) => {
  const [activeIndex, setActiveIndex] = useState<null | number>(null);
  const isAnyOpen = activeIndex !== null;

  // Interact with echap key for close content navbar
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
      }
    };
    document.addEventListener("keydown", handler);
    // Clean up listener
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, []);

  // Close navbar content if click outside
  const navRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(navRef, () => {
    setActiveIndex(null);
  });

  return (
    <div className="flex h-full gap-4" ref={navRef}>
      {PRODUCT_CATEGORIES.map((cat, i) => {
        const handleOpen = () => {
          if (activeIndex === i) {
            setActiveIndex(null);
          } else {
            setActiveIndex(i);
          }
        };

        const isOpen = activeIndex === i;

        return (
          <NavItem
            key={cat.label}
            category={cat}
            isOpen={isOpen}
            handleOpen={handleOpen}
            isAnyOpen={isAnyOpen}
          />
        );
      })}
    </div>
  );
};
