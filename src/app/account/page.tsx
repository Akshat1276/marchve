import Link from "next/link";

export const metadata = {
  title: "Account",
};

export default function AccountPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-margin-mobile pb-section-mobile pt-28 md:px-margin-desktop">
      <div className="w-full max-w-md border border-outline-variant/30 p-12">
        <h1 className="text-center font-headline-md text-primary">M&apos;ARCHVE</h1>
        <p className="mt-3 text-center font-body-small text-on-surface-variant">
          Access your personal archive.
        </p>
        <form className="mt-10 space-y-8">
          <div className="group relative">
            <label className="absolute -top-4 left-0 font-label-caps text-on-surface-variant">
              Email Address
            </label>
            <input
              type="email"
              className="w-full border-0 border-b border-outline-variant bg-transparent py-3 font-body-main text-primary focus:border-primary focus:outline-none"
            />
          </div>
          <div className="group relative">
            <label className="absolute -top-4 left-0 font-label-caps text-on-surface-variant">
              Password
            </label>
            <input
              type="password"
              className="w-full border-0 border-b border-outline-variant bg-transparent py-3 font-body-main text-primary focus:border-primary focus:outline-none"
            />
          </div>
          <button
            type="button"
            className="w-full bg-primary py-4 font-label-caps text-on-primary transition-colors hover:bg-secondary"
          >
            Sign In
          </button>
        </form>
        <p className="mt-8 text-center font-body-small text-on-surface-variant">
          Customer accounts connect once Shopify auth is configured.{" "}
          <Link href="/track-order" className="text-primary underline">
            Track an order
          </Link>{" "}
          without signing in.
        </p>
      </div>
    </div>
  );
}
