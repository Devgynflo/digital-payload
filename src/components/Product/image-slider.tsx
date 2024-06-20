"use client";

import { NextPage } from "next";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import type SwiperType from "swiper";
import { Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageSliderProps {
  urls: string[];
}

export const ImageSlider: NextPage<ImageSliderProps> = ({ urls }) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideConfig, setSlideConfig] = useState({
    isBeginning: true,
    isEnd: activeIndex === (urls.length ?? 0) - 1,
  });

  const activeStyles =
    "active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square size-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300";
  const inactivesStyles = "hidden text-gray-400";

  useEffect(() => {
    swiper?.on("slideChange", ({ activeIndex }) => {
      setActiveIndex(activeIndex),
        setSlideConfig({
          isBeginning: activeIndex === 0,
          isEnd: activeIndex === (urls.length ?? 0) - 1,
        });
    });
  }, [swiper, urls.length]);

  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-100">
      <div className="absolute inset-0 z-10 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.preventDefault();
            swiper?.slideNext();
          }}
          aria-label="next image"
          className={cn(
            activeStyles,
            "right-3 transition",
            slideConfig.isEnd && inactivesStyles,
            !slideConfig.isEnd &&
              "hover:bg-primary-300 text-primary-800 opacity-100",
          )}
        >
          <ChevronRight className="size-4 text-zinc-700" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            swiper?.slidePrev();
          }}
          aria-label="previous image"
          className={cn(
            activeStyles,
            "left-3 transition",
            slideConfig.isBeginning && inactivesStyles,
            !slideConfig.isBeginning &&
              "hover:bg-primary-300 text-primary-800 opacity-100",
          )}
        >
          <ChevronLeft className="size-4 text-zinc-700" />
        </button>
      </div>

      <Swiper
        pagination={{
          renderBullet: (_, className) => {
            return `<span class="rounded-full transition ${className}"></span>`;
          },
        }}
        className="h-full w-full"
        onSwiper={(swiper) => setSwiper(swiper)}
        spaceBetween={50}
        slidesPerView={1}
        modules={[Pagination]}
      >
        {urls.map((url, i) => (
          <SwiperSlide key={url} className="relative -z-10 h-full w-full">
            <Image
              priority
              sizes="100%"
              fill
              loading="eager"
              src={url}
              className="-z-10 h-full w-full object-cover object-center"
              alt="Product image"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
