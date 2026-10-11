import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { store } from "@/config/store";
import { getAllProducts } from "@/modules/products/services/productService";
import { ProductGrid } from "@/components/ProductGrid";
import { AddToCartButton } from "@/components/AddToCartButton";
import { TrustStrip } from "@/components/TrustStrip";
import { Pagination } from "@/components/Pagination";
import { SortSelect } from "@/components/SortSelect";
import { applyCatalogQuery, catalogHref, departmentCounts, parseCatalogQuery } from "@/lib/catalog";
import "./sidebar.css";
import { clampPage, formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: `${store.name} — ${store.hero.headline}` },
  description: store.hero.lead,
  alternates: { canonical: "/" }
};

export default async function HomePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const parsed = parseCatalogQuery(await searchParams);
  const all = await getAllProducts();
  const departments = departmentCounts(all);

  const filtered = applyCatalogQuery(all, parsed);
  const page = clampPage(parsed.page, filtered.length, store.limits.pageSize);
  const query = { ...parsed, page };
  const rows = filtered.slice((page - 1) * store.limits.pageSize, page * store.limits.pageSize);
  const filtering = Boolean(parsed.q || parsed.department || parsed.min !== undefined || parsed.max !== undefined);

  const featured = all.find((p) => p.slug === store.featuredSlug) ?? all[0];
  const prices = all.map((p) => p.regularPrice);

  return (
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1 id="hero-title">{store.hero.headline}</h1>
            <p>{store.hero.lead}</p>
            <div className="row">
              <a href="#catalog" className="btn btn-gold btn-lg">Shop the catalog <ArrowRight size={18} /></a>
              {departments.slice(0, 2).map((d) => (
                <Link key={d.name} href={`/?department=${encodeURIComponent(d.name)}#catalog`} className="btn btn-outline-light btn-lg">{d.name}</Link>
              ))}
            </div>
            <ul className="hero-facts">
              <li><strong>{all.length}</strong> products</li>
              {store.payments.cashOnDelivery && <li><strong>Cash</strong> on delivery</li>}
              {store.shipping.freeOver > 0 && <li><strong>Free</strong> delivery over {formatCurrency(store.shipping.freeOver)}</li>}
            </ul>
          </div>
          {featured && (
            <div className="plinth">
              <Link href={`/products/${featured.slug}`} className="plinth-image" aria-label={`View ${featured.name}`}>
                <Image src={featured.productImageUrl} alt="" fill priority sizes="(max-width: 900px) 80vw, 460px" />
              </Link>
              <div className="plinth-info">
                <div>
                  <span className="chip chip-dark">{featured.departmentName}</span>
                  <Link href={`/products/${featured.slug}`} className="plinth-name">{featured.name}</Link>
                  <strong>{formatCurrency(featured.regularPrice)}</strong>
                </div>
                <AddToCartButton product={featured} />
              </div>
            </div>
          )}
        </div>
      </section>

      {departments.length > 1 && !filtering && (
        <section className="container rooms" aria-label="Departments">
          {departments.map((d) => {
            const sample = all.filter((p) => p.departmentName === d.name).slice(0, 3);
            return (
              <Link key={d.name} href={`/?department=${encodeURIComponent(d.name)}#catalog`} className="room">
                <span>
                  <strong>{d.name}</strong>
                  <small>{d.count} {d.count === 1 ? "product" : "products"}</small>
                </span>
                <span className="room-stack" aria-hidden="true">
                  {sample.map((p) => <span key={p.id}><Image src={p.productImageUrl} alt="" fill sizes="64px" /></span>)}
                </span>
              </Link>
            );
          })}
        </section>
      )}

      <TrustStrip />

      <section className="container catalog" id="catalog" aria-labelledby="catalog-title">
        <div className="catalog-head">
          <h2 id="catalog-title">{parsed.department || "All products"}</h2>
          <p className="muted" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
            {parsed.q ? ` for “${parsed.q}”` : ""}
          </p>
        </div>

        <div className="catalog-layout">
          <aside className="sidebar" aria-label="Filters">
            <div className="side-group">
              <h3>Departments</h3>
              <nav className="side-list" aria-label="Departments">
                <Link href={`${catalogHref(query, { department: "", page: 1 })}#catalog`} aria-current={!parsed.department ? "true" : undefined}>All <small>{all.length}</small></Link>
                {departments.map((d) => (
                  <Link key={d.name} href={`${catalogHref(query, { department: d.name, page: 1 })}#catalog`} aria-current={parsed.department === d.name ? "true" : undefined}>
                    {d.name} <small>{d.count}</small>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="side-group">
              <h3>Price</h3>
              <form action="/" method="get" className="price-form" aria-label="Price range">
                {parsed.q && <input type="hidden" name="q" value={parsed.q} />}
                {parsed.department && <input type="hidden" name="department" value={parsed.department} />}
                {parsed.sort !== "featured" && <input type="hidden" name="sort" value={parsed.sort} />}
                <label><span>Min</span><input type="number" name="min" min={0} step="any" inputMode="decimal" defaultValue={parsed.min} placeholder={String(Math.floor(Math.min(...prices, 0) || 0))} /></label>
                <label><span>Max</span><input type="number" name="max" min={0} step="any" inputMode="decimal" defaultValue={parsed.max} placeholder={String(Math.ceil(Math.max(...prices, 0)))} /></label>
                <button type="submit" className="btn btn-dark btn-sm">Apply</button>
              </form>
            </div>
            <div className="side-group">
              <SortSelect query={query} />
            </div>
            {filtering && <Link href="/#catalog" className="btn btn-ghost btn-sm">Clear all filters</Link>}
          </aside>

          <div className="catalog-main">
            {filtering && (
              <div className="chips" aria-label="Active filters">
                {parsed.q && <Link href={`${catalogHref(query, { q: "", page: 1 })}#catalog`}>Search: {parsed.q} <span aria-hidden="true">×</span></Link>}
                {parsed.department && <Link href={`${catalogHref(query, { department: "", page: 1 })}#catalog`}>{parsed.department} <span aria-hidden="true">×</span></Link>}
                {(parsed.min !== undefined || parsed.max !== undefined) && (
                  <Link href={`${catalogHref(query, { min: undefined, max: undefined, page: 1 })}#catalog`}>
                    Price: {parsed.min !== undefined ? formatCurrency(parsed.min) : "any"} – {parsed.max !== undefined ? formatCurrency(parsed.max) : "any"} <span aria-hidden="true">×</span>
                  </Link>
                )}
              </div>
            )}
            <ProductGrid products={rows} />
            <Pagination query={query} totalCount={filtered.length} pageSize={store.limits.pageSize} />
          </div>
        </div>
      </section>

      <section className="container how" aria-labelledby="how-title">
        <h2 id="how-title">How ordering works</h2>
        <ol>
          <li><strong>Add to cart.</strong> Pick products and quantities. Your cart is saved on this device.</li>
          <li><strong>Enter delivery details.</strong> One short form. Prices are re-checked when you place the order.</li>
          <li><strong>Pay when it arrives.</strong> Cash on delivery, no card needed.</li>
        </ol>
      </section>
    </main>
  );
}
