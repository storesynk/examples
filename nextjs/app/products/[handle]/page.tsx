import { getRequestLocale } from "@storesynk/next";
import { getProduct } from "@storesynk/next/runtime";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { RelatedProductsSection } from "@/components/product/related-products-section";
import { StoresynkProductDetail } from "@/components/product/storesynk-detail";
import { detailLabels } from "@/components/product/storesynk-parts";
import { Container } from "@/components/ui/container";
import { Page } from "@/components/ui/page";
import { Sections } from "@/components/ui/sections";
import { getLocale } from "@/lib/params";
import { buildProductMetadata } from "@/lib/seo";
import { getCatalogProducts } from "@/lib/shopify/operations/products";
import { shopConfig } from "@/shop.config";

const PLACEHOLDER_HANDLE = "__placeholder__";

export async function generateStaticParams() {
  try {
    const { products } = await getCatalogProducts({ limit: 1 });
    const first = products[0];
    return [{ handle: first ? first.handle : PLACEHOLDER_HANDLE }];
  } catch {
    return [{ handle: PLACEHOLDER_HANDLE }];
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[handle]">): Promise<Metadata> {
  const [{ handle }, locale] = await Promise.all([params, getLocale()]);

  if (handle === PLACEHOLDER_HANDLE) return {};

  return buildProductMetadata(handle, locale, `/products/${handle}`);
}

// Params and searchParams render at request time by awaiting them top-level —
// the template's deliberate trade (a complete, no-JS-readable document over a
// streamed shell whose content hides without JS). `instant = false` is the
// sanctioned opt-in for that blocking behavior; without it dev logs a
// blocking-prerender error on every such request.
export const instant = false;

export default async function ProductPage({
  params,
  searchParams,
}: PageProps<"/products/[handle]">) {
  const [{ handle }, raw, locale, t, buyerLocale] = await Promise.all([
    params,
    searchParams,
    getLocale(),
    getTranslations("product"),
    getRequestLocale(),
  ]);
  if (handle === PLACEHOLDER_HANDLE) notFound();

  // The package's cached fetch — the exact entry the wrapper renders from, so
  // this gate costs no extra request.
  const product = await getProduct(handle, buyerLocale);
  if (!product) notFound();

  // Variant URLs (/products/x?Color=Blue) server-render the exact variant;
  // non-option params are ignored by the core selection matching.
  const selectedOptions = Object.fromEntries(
    Object.entries(raw).flatMap(([key, value]) =>
      typeof value === "string" ? [[key, value]] : [],
    ),
  );

  return (
    <Page className="pt-0">
      <Container className="bg-background">
        <Sections>
          <StoresynkProductDetail
            buyerLocale={buyerLocale}
            handle={handle}
            labels={detailLabels(t)}
            selectedOptions={Object.keys(selectedOptions).length ? selectedOptions : undefined}
          />
          {shopConfig.pdp.relatedProducts.enabled ? (
            <RelatedProductsSection handle={handle} limit={4} locale={locale} />
          ) : null}
        </Sections>
      </Container>
    </Page>
  );
}
