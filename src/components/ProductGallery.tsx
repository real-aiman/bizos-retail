"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({ name, images }: { name: string; images: string[] }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  return (
    <div className="gallery">
      <div
        className="detail-image"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setZoom(null)}
      >
        <Image
          key={images[index]}
          src={images[index]}
          alt={`${name} — image ${index + 1} of ${images.length}`}
          fill
          priority={index === 0}
          sizes="(max-width: 900px) 100vw, 56vw"
          style={zoom ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
        />
      </div>
      <div className="thumbs">
        {images.map((src, i) => (
          <button key={src} type="button" className="thumb" aria-pressed={i === index} aria-label={`Show image ${i + 1}`} onClick={() => setIndex(i)}>
            <Image src={src} alt="" fill sizes="72px" />
          </button>
        ))}
      </div>
    </div>
  );
}
