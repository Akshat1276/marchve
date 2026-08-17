"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { StatusTracker } from "@/components/ui/StatusTracker";
import { Loader } from "@/components/ui/Loader";
import { formatINR } from "@/lib/utils";

const schema = z.object({
  orderNumber: z.string().min(3, "Enter your order number"),
  email: z.string().email("Enter the email used at checkout"),
});

type FormValues = z.infer<typeof schema>;

interface TrackResult {
  orderNumber: string;
  placedOn: string;
  step: number;
  items: { title: string; meta: string; price: number }[];
  address: string[];
  total: number;
}

export default function TrackOrderPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Not found");
      setResult(json);
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Unable to find order");
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="px-margin-mobile pb-section-mobile pt-28 md:px-margin-desktop md:pb-section">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 font-label-caps text-on-surface-variant">
          Order Details
        </p>
        <h1 className="font-headline-md text-primary">Track Order</h1>
        <p className="mt-4 max-w-lg font-body-main text-on-surface-variant">
          Enter your order number and email. Status is read from Shopify
          fulfillments (Shiprocket sync).
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-12 grid grid-cols-1 gap-8 border border-outline-variant/30 p-8 md:grid-cols-2"
        >
          <div className="relative">
            <label className="absolute -top-3 left-0 bg-background px-1 font-label-caps text-on-surface-variant">
              Order Number
            </label>
            <input
              {...register("orderNumber")}
              placeholder="MA-84920"
              className="w-full border-0 border-b border-outline-variant bg-transparent py-3 font-body-main focus:border-primary focus:outline-none"
            />
            {errors.orderNumber && (
              <p className="mt-2 font-body-small text-error">
                {errors.orderNumber.message}
              </p>
            )}
          </div>
          <div className="relative">
            <label className="absolute -top-3 left-0 bg-background px-1 font-label-caps text-on-surface-variant">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full border-0 border-b border-outline-variant bg-transparent py-3 font-body-main focus:border-primary focus:outline-none"
            />
            {errors.email && (
              <p className="mt-2 font-body-small text-error">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-primary py-4 font-label-caps text-on-primary transition-colors hover:bg-secondary md:col-span-2"
          >
            Look Up Order
          </button>
        </form>

        {error && (
          <p className="mt-6 font-body-small text-error">{error}</p>
        )}

        {result && (
          <div className="mt-16 space-y-12">
            <div>
              <h2 className="font-headline-md text-primary">
                Order #{result.orderNumber}
              </h2>
              <p className="mt-2 font-body-small text-on-surface-variant">
                Placed on {result.placedOn}
              </p>
            </div>
            <StatusTracker currentStep={result.step} />
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <ul className="space-y-6 lg:col-span-8">
                {result.items.map((item) => (
                  <li
                    key={item.title}
                    className="flex justify-between border-b border-outline-variant/30 pb-4"
                  >
                    <div>
                      <p className="font-body-main text-primary">{item.title}</p>
                      <p className="mt-1 font-data-mono text-on-surface-variant">
                        {item.meta}
                      </p>
                    </div>
                    <p className="font-data-mono">{formatINR(item.price)}</p>
                  </li>
                ))}
              </ul>
              <aside className="space-y-8 lg:col-span-4">
                <div>
                  <h3 className="mb-3 font-label-caps text-on-surface-variant">
                    Shipping Destination
                  </h3>
                  {result.address.map((line) => (
                    <p key={line} className="font-body-small text-primary">
                      {line}
                    </p>
                  ))}
                </div>
                <div className="border border-outline-variant/30 bg-surface-container-low p-6">
                  <div className="flex justify-between font-label-caps">
                    <span>Total</span>
                    <span className="font-data-mono">
                      {formatINR(result.total)}
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90]"
          >
            <Loader fullScreen label="Cataloguing the season…" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
