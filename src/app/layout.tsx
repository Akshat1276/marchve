import type { Metadata } from "next";
import { Lexend_Peta } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NewsletterPopup } from "@/components/layout/NewsletterPopup";
import Script from "next/script";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const lexendPeta = Lexend_Peta({
  variable: "--font-lexend-peta",
  subsets: ["latin"],
  weight: ["400"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "M'ARCHVE — Contemporary Womenswear | Mumbai",
    template: "%s · M'ARCHVE",
  },
  description:
    "M'ARCHVE is a contemporary womenswear label creating elevated wardrobe essentials rooted in modern tailoring and timeless design. Based in Mumbai.",
  applicationName: "M'ARCHVE",
  keywords: [
    "M'ARCHVE",
    "Marchve",
    "womenswear",
    "contemporary fashion",
    "Mumbai fashion",
    "dresses",
    "co-ords",
    "slow fashion",
  ],
  authors: [{ name: "M'ARCHVE", url: siteUrl }],
  creator: "M'ARCHVE",
  publisher: "M'ARCHVE",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "M'ARCHVE",
    title: "M'ARCHVE — Contemporary Womenswear | Mumbai",
    description:
      "Elevated wardrobe essentials rooted in modern tailoring and timeless design. Based in Mumbai.",
  },
  twitter: {
    card: "summary_large_image",
    title: "M'ARCHVE — Contemporary Womenswear | Mumbai",
    description:
      "Elevated wardrobe essentials rooted in modern tailoring and timeless design. Based in Mumbai.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = "G-7FSNDWW9FY";
  return (
      <html lang="en" data-scroll-behavior="smooth" className={`${lexendPeta.variable} h-full antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-on-background">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <NewsletterPopup />
        <MetaPixel />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
            <GoogleAnalytics gaId={gaId} />
          </>
        )}
      </body>
    </html>
  );
}
