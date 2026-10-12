"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

type Props = { src: string; sizes: string; priority?: boolean; className?: string };

/**
 * Tries the optimised /_next/image URL first. If that fails (e.g. 504 timeout on a big
 * remote file), it retries with the original URL straight from the browser, and only then
 * shows a placeholder.
 */
export function ProductImage({ src, sizes, priority = false, className }: Props) {
  const [mode, setMode] = useState<"optimized" | "original" | "failed">("optimized");

  if (mode === "failed") {
    return <span className="img-fallback" role="img" aria-label="Image unavailable"><ImageOff size={28} /></span>;
  }

  return (
    <Image
      key={mode}
      src={src}
      alt=""
      fill
      priority={priority}
      sizes={sizes}
      className={className}
      unoptimized={mode === "original"}
      onError={() => setMode((m) => (m === "optimized" ? "original" : "failed"))}
    />
  );