import devProducts from "@/data/dev-products.json";
import { env } from "@/lib/env";
import type { BizosProduct, ProductListResponse } from "@/types/product";

function normalize(payload: unknown): ProductListResponse {
  const source = payload as Partial<ProductListResponse> & {
    items?: BizosProduct[];
    products?: BizosProduct[];
  };

  const data = Array.isArray(payload)
    ? payload
    : Array.isArray(source.data)
      ? source.data
      : Array.isArray(source.items)
        ? source.items
        : Array.isArray(source.products)
          ? source.products
          : [];

  return {
    lastId: Number(source.lastId ?? 0),
    pageNo: Number(source.pageNo ?? 0),
    pageSize: Number((source.pageSize ?? data.length) || 10),
    totalCount: Number(source.totalCount ?? data.length),
    data: data as BizosProduct[]
  };
}

function buildUrl(): string {
  const base = env.bizosApiUrl.replace(/\/$/, "");
  const path = env.bizosProductsPath.startsWith("/") ? env.bizosProductsPath : `/${env.bizosProductsPath}`;
  return new URL(`${base}${path}`).toString();
}

/** POSTs a search body. Returns null for an empty reply; throws on HTTP errors or invalid JSON. */
async function post(body: Record<string, unknown>, headers: HeadersInit): Promise<unknown | null> {
  const response = await fetch(buildUrl(), {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    next: { revalidate: 60, tags: ["products"] }
  });
  if (!response.ok) {
    throw new Error(`BizOS products request failed with ${response.status}.`);
  }
  const text = await response.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`BizOS products API returned invalid JSON: ${text.slice(0, 80)}`);
  }
}

function emptyPage(page: number): ProductListResponse {
  return { lastId: 0, pageNo: page - 1, pageSize: 0, totalCount: (devProducts as ProductListResponse).totalCount, data: [] };
}

export async function getProducts(page = 1, pageSize = 10): Promise<ProductListResponse> {
  if (!env.bizosApiUrl) {
    if (env.devFallback) return page > 1 ? emptyPage(page) : (devProducts as ProductListResponse);
    throw new Error("BIZOS_API_URL is not configured.");
  }

  const headers: HeadersInit = { Accept: "application/json", "Content-Type": "application/json" };
  if (env.bizosTenantId) headers.TenantId = env.bizosTenantId;
  if (env.bizosApiKey) headers.Authorization = `Bearer ${env.bizosApiKey}`;

  try {
    let payload = await post({ pageNo: page - 1, pageSize }, headers);
    // Some tenants answer an unexpected body with an empty reply; the plain `{}` body is known to work.
    if (payload === null && page === 1) payload = await post({}, headers);
    if (payload === null) {
      if (page > 1) return { lastId: 0, pageNo: page - 1, pageSize: 0, totalCount: 0, data: [] };
      throw new Error("BizOS products API returned an empty response.");
    }
    return normalize(payload);
  } catch (error) {
    if (env.devFallback) {
      return page > 1 ? emptyPage(page) : (devProducts as ProductListResponse);
    }
    throw error;
  }
}