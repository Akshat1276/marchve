"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "@/components/ui/Loader";
import { contact } from "@/content/copy";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Tell us a little more"),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (data) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("ok");
      reset();
    } catch {
      setStatus("error");
    }
  });

  return (
    <>
      <form className="space-y-8" onSubmit={onSubmit}>
        <div className="group relative">
          <label className="absolute -top-4 left-0 font-label-caps text-on-surface-variant transition-colors group-focus-within:text-primary">
            Name
          </label>
          <input
            {...register("name")}
            className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-3 font-body-main text-primary transition-colors focus:border-primary focus:outline-none focus:ring-0"
          />
          {errors.name && (
            <p className="mt-2 font-body-small text-error">{errors.name.message}</p>
          )}
        </div>
        <div className="group relative">
          <label className="absolute -top-4 left-0 font-label-caps text-on-surface-variant transition-colors group-focus-within:text-primary">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-3 font-body-main text-primary transition-colors focus:border-primary focus:outline-none focus:ring-0"
          />
          {errors.email && (
            <p className="mt-2 font-body-small text-error">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="group relative mt-12">
          <label className="absolute -top-4 left-0 font-label-caps text-on-surface-variant transition-colors group-focus-within:text-primary">
            Message
          </label>
          <textarea
            rows={3}
            {...register("message")}
            className="w-full resize-none border-0 border-b border-outline-variant bg-transparent px-0 py-3 font-body-main text-primary transition-colors focus:border-primary focus:outline-none focus:ring-0"
          />
          {errors.message && (
            <p className="mt-2 font-body-small text-error">
              {errors.message.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="mt-8 w-full bg-primary px-12 py-4 font-label-caps text-on-primary transition-colors duration-400 hover:bg-on-surface-variant md:w-auto"
        >
          Submit Inquiry
        </button>
        {status === "ok" && (
          <p className="font-body-small text-primary">
            Received — we&apos;ll reply shortly.
          </p>
        )}
        {status === "error" && (
          <p className="font-body-small text-error">
            Something went wrong. Please email {contact.email}.
          </p>
        )}
      </form>

      <AnimatePresence>
        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90]"
          >
            <Loader fullScreen label="Stitching things together…" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
