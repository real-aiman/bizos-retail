"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, X } from "lucide-react";
import type { BizosProduct } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { isOnSale, savingsPercent } from "@/lib/deals";
import { AddToCartButton } from "./AddToCartButton";

export function QuickView({ product }: { product: BizosProduct }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <>
      <button type="button" className="heart-button" aria-label={`Quick view ${product.name}`} onClick={() => setOpen(true)}>
        <Eye size={17} />
      </button>
      <dialog
        ref={ref}
        className="quickview"
        aria-label={product.name}
        onClose={() => setOpen(false)}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      >
        {open && (
          <div className="qv-body">
            <button type="button" className="icon-btn qv-close" aria-label="Close quick view" onClick={() => setOpen(false)}><X size={20} /></button>
            <div className="qv-image">
              <Image src={product.productImageUrl} alt={product.name} fill sizes="(max-width: 640px) 90vw, 440px" />
            </div>
            <div className="qv-info">
              <span className="chip">{product.departmentName}</span>
              <h2>{product.name}</h2>
              <p className="detail-price">
                {formatCurrency(product.regularPrice)}
                {isOnSale(product) && <><s className="was">{formatCurrency(product.compareAtPrice!)}</s><span className="save-badge">Save {savingsPercent(product)}%</span></>}
              </p>
              {product.description && <p className="detail-copy">{product.description}</p>}
              <div className="row">
                {product.inStock === false ? <span className="banner">Currently out of stock.</span> : <AddToCartButton product={product} className="btn btn-gold btn-lg" />}
                <Link href={`/products/${product.slug}`} className="btn btn-ghost btn-lg">Full details</Link>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
