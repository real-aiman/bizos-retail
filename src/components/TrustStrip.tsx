import { Truck, Wallet, ShieldCheck, Headset } from "lucide-react";
import { store, hasContact } from "@/config/store";
import { formatCurrency } from "@/lib/utils";

/** Only shows promises the business has configured in store.ts. */
export function TrustStrip() {
  const items = [
    store.shipping.freeOver > 0 && { Icon: Truck, title: "Free delivery", text: `On orders over ${formatCurrency(store.shipping.freeOver)}` },
    store.payments.cashOnDelivery && { Icon: Wallet, title: "Cash on delivery", text: "Pay when it arrives" },
    { Icon: ShieldCheck, title: "Saved on this device", text: "Cart and wishlist stay with you" },
    hasContact && { Icon: Headset, title: "Real support", text: "Talk to us anytime from Contact" }
  ].filter(Boolean) as { Icon: typeof Truck; title: string; text: string }[];
  return (
    <section className="container trust" aria-label="Why shop with us">
      {items.map(({ Icon, title, text }) => (
        <div className="trust-item" key={title}>
          <Icon aria-hidden="true" />
          <div><strong>{title}</strong><small>{text}</small></div>
        </div>
      ))}
    </section>
  );
}
