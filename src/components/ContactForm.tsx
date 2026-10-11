"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type Props = { storeName: string; whatsappDigits: string; email: string };

/** No backend needed: the message opens in the customer's WhatsApp or email app, pre-filled. */
export function ContactForm({ storeName, whatsappDigits, email }: Props) {
  const [name, setName] = useState("");
  const [order, setOrder] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const viaWhatsApp = Boolean(whatsappDigits);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Please enter your name.");
    if (message.trim().length < 5) return setError("Please write a short message.");
    setError("");
    const text = `Hi ${storeName}, I'm ${name.trim()}.${order.trim() ? ` Order: ${order.trim()}.` : ""}\n\n${message.trim()}`;
    if (viaWhatsApp) {
      window.open(`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Message from ${name.trim()}`)}&body=${encodeURIComponent(text)}`;
    }
  }

  return (
    <form className="cf" onSubmit={submit} noValidate>
      <label>Your name<input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="e.g. Ayesha Khan" /></label>
      <label>Order number <span className="cf-note">(optional)</span><input value={order} onChange={(e) => setOrder(e.target.value)} placeholder="If your question is about an order" /></label>
      <label>How can we help?<textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what you need, and the product name if you have one." /></label>
      {error && <p className="cf-error" role="alert">{error}</p>}
      <button type="submit" className="btn btn-gold btn-lg"><Send size={18} /> {viaWhatsApp ? "Send on WhatsApp" : "Send by email"}</button>
      <p className="cf-note">{viaWhatsApp ? "This opens WhatsApp with your message ready to send." : "This opens your email app with your message ready to send."}</p>
    </form>
  );
}
