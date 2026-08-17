import Image from "next/image";
import { ContactForm } from "@/components/about/ContactForm";
import { SizeGuideTable } from "@/components/ui/SizeGuideTable";
import { about, brand, contact } from "@/content/copy";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="pt-20">
      <section className="grid min-h-[819px] grid-cols-1 border-b border-outline-variant/20 md:grid-cols-2">
        <div className="relative flex flex-col justify-center bg-surface-container-highest p-margin-mobile md:p-margin-desktop">
          <div className="absolute left-margin-desktop top-margin-desktop hidden md:block">
            <span className="font-label-caps text-on-surface-variant">
              {about.eyebrow}
            </span>
          </div>
          <div className="mx-auto max-w-md md:mx-0 md:ml-auto md:mr-24 lg:mr-32">
            <h1 className="mb-8 font-headline-md leading-tight text-primary">
              {about.title}
            </h1>
            <div className="space-y-6 font-body-main text-on-surface-variant">
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {brand.pillars.map((pillar) => (
                <li
                  key={pillar}
                  className="font-label-caps text-primary"
                >
                  {pillar}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative h-[614px] overflow-hidden md:h-auto">
          <Image
            src="/products/12.jpg"
            alt="Editorial portrait for M'ARCHVE"
            fill
            className="object-cover grayscale transition-all duration-1000 ease-in-out hover:scale-[1.02] hover:grayscale-0"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </section>

      <section className="border-b border-outline-variant/20 bg-background px-margin-mobile py-section-mobile md:px-margin-desktop md:py-section">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <span className="mb-4 block font-label-caps text-on-surface-variant">
              01 — WORLD
            </span>
            <h2 className="font-headline-md text-primary">
              {about.world.title}
            </h2>
          </div>
          <div className="space-y-6 font-body-main text-on-surface-variant md:col-span-8">
            <p className="font-body-main text-primary">{about.world.lead}</p>
            <p>{about.world.body}</p>
            <p>{about.world.debut}</p>
          </div>
        </div>
      </section>

      <section
        id="size-guide"
        className="scroll-mt-24 border-b border-outline-variant/20 bg-background px-margin-mobile py-section-mobile md:px-margin-desktop md:py-section"
      >
        <div className="mx-auto max-w-5xl">
          <SizeGuideTable />
        </div>
      </section>

      <section
        id="contact"
        className="grid min-h-[716px] scroll-mt-24 grid-cols-1 bg-surface-container-low lg:grid-cols-2"
      >
        <div className="flex flex-col justify-center p-margin-mobile md:p-margin-desktop">
          <div className="mx-auto w-full max-w-md">
            <span className="mb-4 block font-label-caps text-on-surface-variant">
              {contact.eyebrow}
            </span>
            <h2 className="mb-12 font-headline-md text-primary">
              {contact.title}
            </h2>
            <ContactForm />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center border-t border-outline-variant/30 bg-surface p-margin-mobile md:p-margin-desktop lg:items-start lg:border-l lg:border-t-0">
          <div className="w-full max-w-md space-y-12">
            <div>
              <h3 className="mb-4 font-label-caps text-on-surface-variant">
                Support
              </h3>
              <a
                href={`mailto:${contact.email}`}
                className="inline-block border-b border-transparent pb-1 font-body-main text-primary transition-colors hover:border-secondary hover:text-secondary"
              >
                {contact.email}
              </a>
              <p className="mt-3 font-body-main text-primary">
                <a
                  href={contact.phoneHref}
                  target="_blank"
                  rel="noreferrer"
                  className="border-b border-transparent transition-colors hover:border-secondary hover:text-secondary"
                >
                  {contact.phoneLabel} {contact.phone}
                </a>
              </p>
              <p className="mt-2 font-body-small text-on-surface-variant">
                {contact.supportNote}
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-label-caps text-on-surface-variant">
                Hours of Operation
              </h3>
              <ul className="space-y-2 font-data-mono text-primary">
                {contact.hours.map((h) => (
                  <li
                    key={h.day}
                    className={`flex justify-between gap-6 border-b border-outline-variant/20 pb-2 ${
                      h.time === "CLOSED" ? "text-on-surface-variant" : ""
                    }`}
                  >
                    <span>{h.day}</span>
                    <span className="text-right">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-label-caps text-on-surface-variant">
                {contact.location.label}
              </h3>
              <p className="font-body-main text-primary">
                {contact.location.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
