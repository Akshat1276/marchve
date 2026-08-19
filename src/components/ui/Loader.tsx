"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { loaderLines } from "@/content/copy";
import { BrandName } from "@/components/ui/BrandName";
import { cn } from "@/lib/utils";

interface LoaderProps {
  fullScreen?: boolean;
  className?: string;
  label?: string;
  variant?: "default" | "onDark";
}

export function Loader({
  fullScreen = false,
  className,
  label,
  variant = "default",
}: LoaderProps) {
  const [index, setIndex] = useState(0);
  const onDark = variant === "onDark";

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % loaderLines.length);
    }, 1800);
    return () => window.clearInterval(id);
  }, []);

  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-8 px-8 text-center",
        className
      )}
    >
      <BrandName className={onDark ? "text-white" : undefined} />
      <div
        className={cn(
          "relative h-px w-48 overflow-hidden",
          onDark ? "bg-white/20" : "bg-outline-variant/40"
        )}
      >
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0",
            onDark ? "bg-white" : "bg-primary"
          )}
          initial={{ width: "0%" }}
          animate={{ width: ["0%", "100%", "0%"] }}
          transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
        />
      </div>
      <div className="h-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={label ?? loaderLines[index]}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 0.9, 0.3, 1] }}
            className={cn(
              "font-label-caps",
              onDark ? "text-white/70" : "text-on-surface-variant"
            )}
          >
            {label ?? loaderLines[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-xl">
        {content}
      </div>
    );
  }

  return content;
}

export function PageLoader({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center py-section-mobile md:py-section">
      <Loader label={label} />
    </div>
  );
}
