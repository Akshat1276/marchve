"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ProductImage } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

interface CircularCarouselProps {
  images: ProductImage[];
  onIndexChange?: (index: number) => void;
}

/** Cards peeking behind the focused frame, stacked to the right. */
const RANGE = 4;
/** Portrait card aspect in layout units (width / height ≈ 3/4). */
const BOX_W = 0.68;
const BOX_H = 0.9067;
/** Desktop peek spacing — keeps a clear stack without wasting width. */
const PEEK_X = 0.05;
/** Tighter peek on narrow screens so the front card can grow. */
const PEEK_X_MOBILE = 0.032;
const STACK_OPACITY = [1, 0.78, 0.58, 0.4, 0.26];
const SWIPE_THRESHOLD = 48;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

/**
 * Cascade gallery: the focused frame sits large in front; remaining shots
 * fan to the right behind it. Click / swipe a card to bring it forward.
 */
export function CircularCarousel({
  images,
  onIndexChange,
}: CircularCarouselProps) {
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState({ w: 0, h: 0 });
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
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

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const w = rect.width || el.clientWidth;
      const h = rect.height || el.clientHeight;
      if (w > 0 && h > 0) setStage({ w, h });
    };

    measure();
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    window.addEventListener("orientationchange", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientX;
    if (end == null) return;
    const delta = end - start;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    // Swipe left → next; swipe right → previous
    goTo(delta < 0 ? index + 1 : index - 1);
  };

  if (!images.length) {
    return (
      <div className="relative h-[70vh] bg-surface-container-low md:h-screen" />
    );
  }

  if (reduceMotion) {
    return (
      <div className="relative flex h-[70vh] flex-col items-center justify-center bg-surface-container-low px-6 py-12 md:h-screen">
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

  const isNarrow = stage.w > 0 && stage.w < 768;
  const peekX = isNarrow ? PEEK_X_MOBILE : PEEK_X;
  const spanLeft = BOX_W / 2;
  const spanRight = BOX_W / 2 + RANGE * peekX;
  const spanVert = BOX_H / 2;

  // Use nearly the full stage width; tighter peeks free room for a larger front card.
  const widthPad = isNarrow ? 0.97 : 0.94;
  const heightPad = isNarrow ? 0.9 : 0.86;
  const widthBasis =
    stage.w > 0 ? (stage.w * widthPad) / (spanLeft + spanRight) : 0;
  const heightBasis =
    stage.h > 0 ? (stage.h * heightPad) / (spanVert * 2) : widthBasis;
  const basis =
    widthBasis > 0 && heightBasis > 0
      ? Math.min(widthBasis, heightBasis)
      : Math.max(widthBasis, heightBasis);

  const boxW = BOX_W * basis;
  const boxH = BOX_H * basis;
  const originX = stage.w * 0.5 - ((spanRight - spanLeft) / 2) * basis;
  const originY = stage.h / 2;

  return (
    <div
      className="relative h-[70vh] overflow-hidden bg-surface-container-low touch-pan-y md:h-screen"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        ref={stageRef}
        className="absolute inset-0"
        role="listbox"
        aria-label="Product images"
      >
        {basis > 0 &&
          images.map((image, i) => {
            const fan = mod(i - index, images.length);
            if (fan > RANGE) return null;

            const isActive = fan === 0;
            const x = originX + fan * peekX * basis;
            const y = originY;
            const opacity = STACK_OPACITY[fan] ?? 0.26;

            return (
              <motion.button
                key={`${image.src}-${i}`}
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
                    : {
                        x: x - boxW / 2 + 6,
                        opacity: Math.min(1, opacity + 0.18),
                      }
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
                  sizes={isActive ? "(max-width: 768px) 85vw, 48vw" : "28vw"}
                  priority={isActive || fan <= 1}
                />
              </motion.button>
            );
          })}
      </div>

      <div className="pointer-events-none absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 md:bottom-20">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to image ${i + 1}`}
            onClick={() => goTo(i)}
            className={cn(
              "pointer-events-auto h-1.5 transition-all duration-500",
              i === index
                ? "w-6 bg-primary"
                : "w-1.5 bg-outline-variant/50 hover:bg-secondary"
            )}
          />
        ))}
      </div>

      <p className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap text-center font-label-caps text-on-surface-variant md:bottom-10">
        <span className="md:hidden">Swipe or tap a card</span>
        <span className="hidden md:inline">Click a card to bring it forward</span>
      </p>
    </div>
  );
}
