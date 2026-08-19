export const metadata = {
  title: "Shipping & Delivery Policy",
};

export default function ShippingDeliveryPage() {
  return (
    <div className="px-margin-mobile pb-section-mobile pt-28 md:px-margin-desktop md:pb-section">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-headline-md text-primary">Shipping & Delivery Policy</h1>
        <div className="mt-10 space-y-6 border-t border-outline-variant/30 pt-8 font-body-main text-on-surface-variant">
          <p>
            M‘ARCHVE is committed to delivering your pieces with care and
            efficiemcy. Please allow up to 5 business days for your order to be
            processed.
          </p>
          <p>
            We offer complimentary shipping on all domestic orders within India.
            Once your order has been dispatched, you'll receive a tracking link
            via email so you can follow your shipment every step of the way.
          </p>
          <p>
            If you notice an error in your shipping details or would like to
            update your order, please contact maisonmarchve@gmail.com as soon as
            possible. If production or dispatch hasn't begun, our team will do
            their best to accommodate your request.
          </p>
        </div>
      </div>
    </div>
  );
}
