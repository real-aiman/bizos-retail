"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button type="button" className={`to-top no-print${show ? " show" : ""}`} aria-label="Back to top" tabIndex={show ? 0 : -1} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
      <ArrowUp size={20} />
    </button>
  );
}
