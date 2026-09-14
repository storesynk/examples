import { getRequestLocale, parseListingParams } from "@storesynk/next";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { CollectionDetailPage } from "@/components/collections/collection-page";
import { getLocale } from "@/lib/params";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { getCollection, getCollections } from "@/lib/shopify/operations/collections";

const PLACEHOLDER_HANDLE = "__placeholder__";

export async function generateStaticParams() {
  try {
    const collections = await getCollections({ limit: 1 });
    const first = collections[0];
    return [{ handle: first ? first.handle : PLACEHOLDER_HANDLE }];
  } catch {
    return [{ handle: PLACEHOLDER_HANDLE }];
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/collections/[handle]">): Promise<Metadata> {
  const [{ handle }, locale] = await Promise.all([params, getLocale()]);

  if (handle === PLACEHOLDER_HANDLE) {
    notFound();
  }

  const [collection, t] = await Promise.all([
    getCollection({ handle, locale }),
    getTranslations("seo"),
  ]);

  if (!collection) {
    const title = t("collectionFallbackTitle");
    const description = t("collectionFallbackDescription");

    return {
      title,
      description,
      alternates: buildAlternates({
        pathname: `/collections/${handle}`,
      }),
      openGraph: buildOpenGraph({
        title,
        description,
        url: `/collections/${handle}`,
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

  const title = collection.seo.title;
  const description = collection.seo.description;

  return {
    title,
    description,
    alternates: buildAlternates({
      pathname: `/collections/${collection.handle}`,
    }),
    openGraph: buildOpenGraph({
      title,
      description,
      url: `/collections/${collection.handle}`,
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

// Non-generated handles render at request time by awaiting params top-level —
// the template's deliberate trade (a complete, no-JS-readable document over a
// streamed shell whose content hides without JS). `instant = false` is the
// sanctioned opt-in for that blocking behavior; without it dev logs a
// blocking-prerender error on every such request. (Same as /products/[handle].)
export const instant = false;

export default async function CollectionPage({
  params,
  searchParams,
}: PageProps<"/collections/[handle]">) {
  const [{ handle }, locale, buyerLocale, resolvedSearchParams] = await Promise.all([
    params,
    getLocale(),
    getRequestLocale(),
    searchParams,
  ]);
  if (handle === PLACEHOLDER_HANDLE) notFound();

  const collection = await getCollection({ handle, locale });
  if (!collection) notFound();

  return (
    <CollectionDetailPage
      buyerLocale={buyerLocale}
      collection={collection}
      handle={handle}
      listingState={parseListingParams(resolvedSearchParams)}
      locale={locale}
    />
  );
}
