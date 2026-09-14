import { getRequestLocale, parseListingParams } from "@storesynk/next";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CollectionDetailPage } from "@/components/collections/collection-page";
import { ALL_PRODUCTS_HANDLE, getAllProductsCollection } from "@/lib/collections/server";
import { getLocale } from "@/lib/params";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("collections.all");
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    alternates: buildAlternates({
      pathname: `/collections/${ALL_PRODUCTS_HANDLE}`,
    }),
    openGraph: buildOpenGraph({
      title,
      description,
      url: `/collections/${ALL_PRODUCTS_HANDLE}`,
      type: "website",
    }),
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-default.png"],
    },
  };
}

// Reading the buyer's market cookie makes this route render at request time;
// `instant = false` opts into that blocking render (same as /collections/[handle]).
export const instant = false;

export default async function AllProductsPage({ searchParams }: PageProps<"/collections/all">) {
  const [locale, collection, buyerLocale, resolvedSearchParams] = await Promise.all([
    getLocale(),
    getAllProductsCollection(),
    getRequestLocale(),
    searchParams,
  ]);

  return (
    <CollectionDetailPage
      buyerLocale={buyerLocale}
      collection={collection}
      handle={ALL_PRODUCTS_HANDLE}
      listingState={parseListingParams(resolvedSearchParams)}
      locale={locale}
    />
  );
}
