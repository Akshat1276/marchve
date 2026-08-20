"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { BrandName } from "@/components/ui/BrandName";
import { openNewsletterSuccess } from "@/components/layout/NewsletterPopup";
import { social } from "@/content/copy";

const EXPLORE = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Us" },
  { href: "/about#size-guide", label: "Size Guide" },
  { href: "/shipping-returns", label: "Return & Exchange Policy" },
  { href: "/shipping-delivery", label: "Shipping & Delivery Policy" },
  { href: "/track-order", label: "Track Order" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    // No backend yet — treat as successful opt-in and show confirmation.
    window.setTimeout(() => {
      setEmail("");
      setSubmitting(false);
      openNewsletterSuccess();
    }, 250);
  };

  return (
    <footer className="w-full border-t border-outline-variant/20 bg-surface-container-low px-margin-mobile py-section-mobile text-on-surface md:px-margin-desktop md:py-section">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-gutter md:grid-cols-12">
        <div className="flex flex-col justify-between md:col-span-5">
          <div>
            <BrandName size="footer" />
            <p className="mt-6 font-body-small text-on-surface-variant">
              © {new Date().getFullYear()} M&apos;ARCHVE. All rights reserved.
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          <h3 className="mb-6 font-label-caps text-primary">Explore</h3>
          <div className="flex flex-col space-y-4">
            {EXPLORE.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-body-small text-on-surface-variant transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div id="newsletter" className="scroll-mt-28 md:col-span-4">
          <h3 className="mb-6 font-label-caps text-primary">Newsletter</h3>
          <p className="mb-8 font-body-small text-on-surface-variant">
            Join the archive for early access to new collections.
          </p>
          <form
            onSubmit={onSubscribe}
            className="flex items-end border-b border-outline-variant pb-2"
          >
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              autoComplete="email"
              className="flex-grow border-0 bg-transparent p-0 font-body-small text-primary placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              disabled={submitting}
              className="ml-4 whitespace-nowrap font-label-caps text-primary transition-colors hover:text-secondary disabled:opacity-50"
            >
              {submitting ? "…" : "Subscribe"}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-5">
            <a
              href={social.instagram.href}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-primary transition-opacity hover:opacity-70"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
            <a
              href={social.whatsapp.href}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="text-primary transition-opacity hover:opacity-70"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.413A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 9.5c.138-.345.48-.9.9-1.1.35-.17.75-.17 1.1 0 .28.14.48.4.6.7l.5 1.2c.1.24.06.52-.1.72l-.5.6c-.1.12-.12.28-.05.42.4.8 1.05 1.45 1.85 1.85.14.07.3.05.42-.05l.6-.5c.2-.16.48-.2.72-.1l1.2.5c.3.12.56.32.7.6.17.35.17.75 0 1.1-.2.42-.75.76-1.1.9-.9.36-2.16.1-3.6-1.35C8.4 11.66 8.14 10.4 8.5 9.5z"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
