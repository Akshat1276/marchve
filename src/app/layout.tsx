import type { Metadata } from "next";
import { Lexend_Peta } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NewsletterPopup } from "@/components/layout/NewsletterPopup";
import "./globals.css";

const lexendPeta = Lexend_Peta({
  variable: "--font-lexend-peta",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    default: "M'ARCHVE — A Modern Archive",
    template: "%s · M'ARCHVE",
  },
  description:
    "M'ARCHVE is a contemporary womenswear label creating elevated wardrobe essentials rooted in modern tailoring and timeless design. Based in Mumbai.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      </body>
    </html>
  );
}
