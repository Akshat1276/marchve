"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ProductImage } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

interface CircularCarouselProps {
  images: ProductImage[];
  onIndexChange?: (index: number) => void;
}

/** Cards peeking behind the focused frame, stacked to the right. */
const RANGE = 4;
/**
 * Focused frame is 1.5× the previous circular carousel (0.375 × 0.5).
 * Every card shares the same size and stays upright — only X offset changes.
 */
const BOX_W = 0.5625;
const BOX_H = 0.75;
/** Horizontal peek per stacked card, in `basis` units. */
const PEEK_X = 0.09;
const STACK_OPACITY = [1, 0.78, 0.58, 0.4, 0.26];

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

/**
 * Cascade gallery: the focused frame sits large in front; remaining shots
 * fan to the right behind it. Click a peeking card to bring it forward.
 */
export function CircularCarousel({
  images,
  onIndexChange,
}: CircularCarouselProps) {
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState({ w: 0, h: 0 });
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const goTo = useCallback(
    (next: number) => {
      if (!images.length) return;
      const clamped = mod(next, images.length);
      setIndex(clamped);
      onIndexChange?.(clamped);
    },
    [images.length, onIndexChange]
  );

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setStage({ w: width, h: height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  if (!images.length) {
    return (
      <div className="relative flex h-full min-h-[70vh] items-center justify-center bg-surface-container-low md:min-h-screen" />
    );
  }

  if (reduceMotion) {
    return (
      <div className="relative flex h-full min-h-[70vh] flex-col items-center justify-center bg-surface-container-low px-6 py-12 md:min-h-screen">
        <div className="relative aspect-[3/4] w-full max-w-xl overflow-hidden shadow-2xl">
          <Image
            src={images[index].src}
            alt={images[index].alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 90vw, 48vw"
            priority
          />
        </div>
        <div className="mt-8 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Image ${i + 1}`}
              onClick={() => goTo(i)}
              className={cn(
                "h-1.5 transition-all",
                i === index ? "w-6 bg-primary" : "w-1.5 bg-outline-variant"
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  const spanLeft = BOX_W / 2;
  const spanRight = BOX_W / 2 + RANGE * PEEK_X;
  const spanVert = BOX_H / 2;

  const basis = Math.min(
    (stage.w * 0.9) / (spanLeft + spanRight),
    (stage.h * 0.86) / (spanVert * 2)
  );
  const boxW = BOX_W * basis;
  const boxH = BOX_H * basis;
  const originX = stage.w * 0.5 - ((spanRight - spanLeft) / 2) * basis;
  const originY = stage.h / 2;

  return (
    <div className="relative flex h-full min-h-[70vh] items-center justify-center overflow-hidden bg-surface-container-low md:min-h-screen">
      <div
        ref={stageRef}
        className="relative h-full w-full"
        role="listbox"
        aria-label="Product images"
      >
        {basis > 0 &&
          images.map((image, i) => {
            const fan = mod(i - index, images.length);
            if (fan > RANGE) return null;

            const isActive = fan === 0;
            const x = originX + fan * PEEK_X * basis;
            const y = originY;
            const opacity = STACK_OPACITY[fan] ?? 0.26;

            return (
              <motion.button
                key={i}
                type="button"
                role="option"
                aria-selected={isActive}
                aria-label={
                  isActive
                    ? `Current image: ${image.alt}`
                    : `Show image ${i + 1}`
                }
                className={cn(
                  "absolute left-0 top-0 overflow-hidden focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  isActive ? "cursor-default" : "cursor-pointer"
                )}
                style={{
                  width: boxW,
                  height: boxH,
                  zIndex: 40 - fan,
                  boxShadow: isActive
                    ? "0 25px 50px rgb(0 0 0 / 0.25)"
                    : "0 8px 20px rgb(0 0 0 / 0.12)",
                }}
                initial={false}
                animate={{
                  x: x - boxW / 2,
                  y: y - boxH / 2,
                  scale: 1,
                  rotate: 0,
                  opacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 32,
                  mass: 0.7,
                }}
                whileHover={
                  isActive
                    ? undefined
                    : { x: x - boxW / 2 + 6, opacity: Math.min(1, opacity + 0.18) }
                }
                onClick={() => {
                  if (!isActive) goTo(i);
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  draggable={false}
                  className="pointer-events-none select-none object-cover"
                  sizes={isActive ? "(max-width: 768px) 80vw, 48vw" : "28vw"}
                  priority={isActive}
                />
              </motion.button>
            );
          })}
      </div>

      <div className="absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 md:bottom-20">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to image ${i + 1}`}
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 transition-all duration-500",
              i === index
                ? "w-6 bg-primary"
                : "w-1.5 bg-outline-variant/50 hover:bg-secondary"
            )}
          />
        ))}
      </div>

      <p className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap text-center font-label-caps text-on-surface-variant md:bottom-10">
        Click a card to bring it forward
      </p>
    </div>
  );
}
