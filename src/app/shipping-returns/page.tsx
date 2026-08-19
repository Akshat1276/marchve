import Link from "next/link";
import { contact, shippingReturns } from "@/content/copy";

export const metadata = {
  title: "Returns & Exchanges Policy",
};

export default function ShippingReturnsPage() {
  return (
    <div className="px-margin-mobile pb-section-mobile pt-28 md:px-margin-desktop md:pb-section">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-headline-md text-primary">{shippingReturns.title}</h1>
        {shippingReturns.intro ? (
          <p className="mt-6 font-body-main text-on-surface-variant">
            {shippingReturns.intro}
          </p>
        ) : null}
        <div
          className={`space-y-12 ${shippingReturns.intro ? "mt-16" : "mt-10"}`}
        >
          {shippingReturns.sections.map((section) => (
            <section
              key={section.heading}
              className="border-t border-outline-variant/30 pt-8"
            >
              <h2 className="mb-4 font-label-caps text-primary">
                {section.heading}
              </h2>
              {section.body ? (
                <p className="mb-6 font-body-main text-on-surface-variant">
                  {section.body}
                </p>
              ) : null}
              {"paragraphs" in section && section.paragraphs ? (
                <div className="space-y-4 font-body-main text-on-surface-variant">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
              {"bullets" in section && section.bullets ? (
                <ul className="space-y-3 font-body-main text-on-surface-variant">
                  {section.bullets.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <p className="mt-16 border-t border-outline-variant/30 pt-8 font-body-small text-on-surface-variant">
          Prefer WhatsApp?{" "}
          <a
            href={contact.phoneHref}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            {contact.phone}
          </a>
          {" · "}
          <Link
            href="/about#contact"
            className="text-primary underline-offset-4 hover:underline"
          >
            Contact form
          </Link>
        </p>
      </div>
    </div>
  );
}
