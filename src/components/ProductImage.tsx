"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

type Props = { src: string; sizes: string; priority?: boolean; className?: string };

export function ProductImage({ src, sizes, priority = false, className }: Props) {
  const [mode, setMode] = useState<"optimized" | "original" | "failed">("optimized");

  if (mode === "failed") {
    return (
      <span className="img-fallback" role="img" aria-label="Image unavailable">
        <ImageOff size={28} />
      </span>
    );
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
}