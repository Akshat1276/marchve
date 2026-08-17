"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  Component,
  useEffect,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { brand } from "@/content/copy";
import type { Product } from "@/lib/shopify/types";
import { Loader } from "@/components/ui/Loader";

const VortexCanvas = dynamic(
  () => import("./VortexScene").then((m) => m.VortexCanvas),
  { ssr: false }
);

interface VortexGalleryProps {
  products: Product[];
}

class GalleryErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("[VortexGallery] falling back to static grid", error, info);
    this.props.onError();
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

export function VortexGallery({ products }: VortexGalleryProps) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [webglOk, setWebglOk] = useState(true);
  const [forceFallback, setForceFallback] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const ok = !!(
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      );
      setWebglOk(ok);
      if (!ok) setReady(true);
    } catch {
      setWebglOk(false);
      setReady(true);
    }
  }, []);

  const showFallback = reduceMotion || !webglOk || forceFallback;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-hero-ink text-white">
      {!ready && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-hero-ink text-white">
          <Loader variant="onDark" />
        </div>
      )}

      {showFallback ? (
        <StaticFallback products={products} onReady={() => setReady(true)} />
      ) : (
        <GalleryErrorBoundary
          onError={() => {
            setForceFallback(true);
            setReady(true);
          }}
        >
          <VortexCanvas
            products={products}
            onReady={() => setReady(true)}
            onError={() => {
              setForceFallback(true);
              setReady(true);
            }}
          />
        </GalleryErrorBoundary>
      )}

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 16 }}
          transition={{ duration: 0.8, ease: [0.22, 0.9, 0.3, 1] }}
          className="relative px-14 py-8 text-center md:px-16 md:py-12"
        >
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 h-[220%] w-[160%] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(20,17,16,0.55) 0%, rgba(20,17,16,0.28) 42%, transparent 72%)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              maskImage:
                "radial-gradient(ellipse at center, black 28%, transparent 72%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 28%, transparent 72%)",
            }}
          />
          <h1 className="font-display-lg text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
            {brand.name}
          </h1>
          <p className="mt-4 font-label-caps text-white/85 drop-shadow-[0_1px_12px_rgba(0,0,0,0.4)]">
            {brand.tagline}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-white/60"
      >
        <span className="material-symbols-outlined animate-bounce">
          expand_more
        </span>
      </motion.div>
    </section>
  );
}

function StaticFallback({
  products,
  onReady,
}: {
  products: Product[];
  onReady: () => void;
}) {
  useEffect(() => {
    onReady();
  }, [onReady]);

  return (
    <div className="absolute inset-0 grid grid-cols-2 gap-2 p-margin-mobile pt-24 md:grid-cols-4 md:gap-4 md:p-margin-desktop">
      {products.slice(0, 8).map((p) => (
        <Link
          key={p.handle}
          href={`/product/${p.handle}`}
          className="relative aspect-[3/4] overflow-hidden border border-white/10"
        >
          <Image
            src={p.images[0].src}
            alt={p.images[0].alt}
            fill
            className="object-cover opacity-80 transition-opacity hover:opacity-100"
            sizes="25vw"
          />
        </Link>
      ))}
    </div>
  );
}
