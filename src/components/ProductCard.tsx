import Link from "next/link";
import { AddToCartButton } from "./AddToCartButton";
import { WishlistButton } from "./WishlistButton";
import type { BizosProduct } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { unitLabel } from "@/lib/catalog";
import { isOnSale, savingsPercent } from "@/lib/deals";
import { QuickView } from "./QuickView";
import { CompareButton } from "./CompareButton";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product, priority = false }: { product: BizosProduct; priority?: boolean }) {
  const unit = unitLabel(product);
  const onSale = isOnSale(product);
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`} tabIndex={-1}>
          <ProductImage
            src={product.productImageUrl}
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1000px) 33vw, 25vw"
            className="product-image"
          />
        </Link>
        {onSale && <span className="sale-flag">−{savingsPercent(product)}%</span>}
        <span className="card-buttons">
          <QuickView product={product} />
          <CompareButton id={product.id} name={product.name} />
          <WishlistButton id={product.id} name={product.name} />
        </span>
      </div>
      <div className="product-card-body">
        <span className="product-dept">{product.departmentName}</span>
        <Link href={`/products/${product.slug}`} className="product-title">{product.name}</Link>
        <p className="product-price">
          <strong>{formatCurrency(product.regularPrice)}</strong>
          {unit && <span className="unit">/ {unit}</span>}
          {onSale && <s className="was">{formatCurrency(product.compareAtPrice!)}</s>}
        </p>
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}