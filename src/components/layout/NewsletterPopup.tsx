"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrandName } from "@/components/ui/BrandName";

const STORAGE_KEY = "marchve-newsletter-prompt";

type PromptState = "hidden" | "prompt" | "success";

export function openNewsletterSuccess() {
  window.dispatchEvent(new CustomEvent("marchve:newsletter-success"));
}

function readDismissed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markDismissed() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function NewsletterPopup() {
  const [state, setState] = useState<PromptState>("hidden");

  useEffect(() => {
    if (readDismissed()) return;

    const timer = window.setTimeout(() => {
      setState("prompt");
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onSuccess = () => {
      markDismissed();
      setState("success");
    };
    window.addEventListener("marchve:newsletter-success", onSuccess);
    return () =>
      window.removeEventListener("marchve:newsletter-success", onSuccess);
  }, []);

  useEffect(() => {
    if (state === "hidden") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        markDismissed();
        setState("hidden");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [state]);

  const dismiss = () => {
    markDismissed();
    setState("hidden");
  };

  const accept = () => {
    markDismissed();
    setState("hidden");
    requestAnimationFrame(() => {
      const field = document.getElementById("newsletter-email");
      field?.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => field?.focus(), 450);
    });
  };

  return (
    <AnimatePresence>
      {state !== "hidden" && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-primary/45 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={dismiss}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="newsletter-popup-title"
            className="relative w-full max-w-md bg-surface px-8 py-10 text-center shadow-[0_24px_60px_rgba(59,31,28,0.18)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center text-primary transition-opacity hover:opacity-60"
            >
              <span className="material-symbols-outlined text-[22px]">
                close
              </span>
            </button>

            <div className="flex justify-center">
              <BrandName size="footer" />
            </div>

            {state === "prompt" ? (
              <>
                <h2
                  id="newsletter-popup-title"
                  className="mt-8 font-headline-md text-primary"
                >
                  Join the archive
                </h2>
                <p className="mt-4 font-body-main text-on-surface-variant">
                  Subscribe to the newsletter for early access to new
                  collections, updates, and offers.
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={accept}
                    className="bg-primary px-8 py-3 font-label-caps text-on-primary transition-opacity hover:opacity-90"
                  >
                    Subscribe
                  </button>
                  <button
                    type="button"
                    onClick={dismiss}
                    className="px-8 py-3 font-label-caps text-on-surface-variant transition-colors hover:text-primary"
                  >
                    Not now
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2
                  id="newsletter-popup-title"
                  className="mt-8 font-headline-md text-primary"
                >
                  You&apos;re in
                </h2>
                <p className="mt-4 font-body-main text-on-surface-variant">
                  Stay tuned for updates and offers.
                </p>
                <button
                  type="button"
                  onClick={dismiss}
                  className="mt-10 bg-primary px-8 py-3 font-label-caps text-on-primary transition-opacity hover:opacity-90"
                >
                  Close
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
