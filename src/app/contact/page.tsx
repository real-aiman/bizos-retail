import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock3, HelpCircle, Mail, MapPin, MessageCircle, Package, Phone, ShoppingBag } from "lucide-react";
import { store, hasContact } from "@/config/store";
import { ContactForm } from "@/components/ContactForm";
import "./contact.css";

export const metadata: Metadata = { title: "Contact", description: `Get in touch with ${store.name}.` };

const digits = (value: string) => value.replace(/[^\d]/g, "");

export default function ContactPage() {
  const { email, phone, whatsapp, address, hours } = store.contact;
  const channels = [
    whatsapp && { key: "wa", Icon: MessageCircle, title: "WhatsApp", value: "Chat with us", cta: "Start a chat", href: `https://wa.me/${digits(whatsapp)}`, external: true },
    phone && { key: "ph", Icon: Phone, title: "Call us", value: phone, cta: "Call now", href: `tel:${phone.replace(/\s/g, "")}`, external: false },
    email && { key: "em", Icon: Mail, title: "Email", value: email, cta: "Write to us", href: `mailto:${email}`, external: false }
  ].filter(Boolean) as { key: string; Icon: typeof Mail; title: string; value: string; cta: string; href: string; external: boolean }[];

  return (
    <main id="main" className="container contact">
      <header className="contact-hero">
        <span className="contact-eyebrow">Contact</span>
        <h1>We&rsquo;d love to hear from you.</h1>
        <p>Questions about a product, an order or delivery? Send us a message and we&rsquo;ll get back to you.</p>
      </header>

      {hasContact ? (
        <>
          <section className="contact-grid" aria-label="Ways to reach us">
            {channels.map(({ key, Icon, title, value, cta, href, external }) => (
              <a key={key} className={`cc-card ${key}`} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                <span className="cc-icon"><Icon size={24} aria-hidden="true" /></span>
                <strong>{title}</strong>
                <span className="value">{value}</span>
                <span className="cc-cta">{cta} <ArrowUpRight size={16} aria-hidden="true" /></span>
              </a>
            ))}
          </section>

          <section className="contact-split">
            <div className="contact-panel">
              <h2>Send us a message</h2>
              <p className="cf-note">Include your order number and the product name so we can help faster.</p>
              <ContactForm storeName={store.name} whatsappDigits={whatsapp ? digits(whatsapp) : ""} email={email} />
            </div>
            <div className="contact-panel">
              <h2>Good to know</h2>
              {(address || hours) && (
                <ul className="info-list">
                  {hours && <li><Clock3 size={20} aria-hidden="true" /><span><strong>Hours</strong><br />{hours}</span></li>}
                  {address && <li><MapPin size={20} aria-hidden="true" /><span><strong>Visit us</strong><br />{address}</span></li>}
                </ul>
              )}
              <HelpLinks />
            </div>
          </section>
        </>
      ) : (
        <section className="contact-panel contact-soon">
          <h2>Our contact channels are being set up</h2>
          <p>In the meantime these pages can help.</p>
          <HelpLinks />
          {process.env.NODE_ENV !== "production" && (
            <p className="banner">Owner note (hidden on the live site): set NEXT_PUBLIC_SUPPORT_EMAIL, NEXT_PUBLIC_SUPPORT_PHONE or NEXT_PUBLIC_SUPPORT_WHATSAPP.</p>
          )}
        </section>
      )}
    </main>
  );
}

function HelpLinks() {
  return (
    <nav className="help-links" aria-label="Quick help">
      <Link href="/faq"><span><HelpCircle size={18} aria-hidden="true" /> Read the FAQ</span><ArrowUpRight size={16} aria-hidden="true" /></Link>
      <Link href="/dashboard/orders"><span><Package size={18} aria-hidden="true" /> Check my orders</span><ArrowUpRight size={16} aria-hidden="true" /></Link>
      <Link href="/#catalog"><span><ShoppingBag size={18} aria-hidden="true" /> Keep shopping</span><ArrowUpRight size={16} aria-hidden="true" /></Link>
    </nav>
  );
}
