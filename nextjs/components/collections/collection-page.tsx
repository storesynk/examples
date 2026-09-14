import { StoresynkCollection, type I18nState, type ListingSearchState } from "@storesynk/next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { BreadcrumbSchema } from "@/components/schema/breadcrumb-schema";
import { CollectionSchema } from "@/components/schema/collection-schema";
import { Container } from "@/components/ui/container";
import { Page } from "@/components/ui/page";
import { Sections } from "@/components/ui/sections";
import { ALL_PRODUCTS_HANDLE } from "@/lib/collections/server";
import type { Locale } from "@/lib/i18n";
import { getCollections } from "@/lib/shopify/operations/collections";
import type { Collection } from "@/lib/types";
import { cn } from "@/lib/utils";

const FACET_HEADING = "text-base font-semibold text-foreground";
const FACET_SECTION = "grid content-start gap-2.5 border-t border-border pt-5 [&[ss-empty]]:hidden";
const CHECK_ROW = "flex cursor-pointer items-center gap-2.5 text-sm text-foreground";
const CHECK_BOX =
  "size-5 shrink-0 cursor-pointer appearance-none border border-border transition-colors checked:border-foreground checked:bg-foreground";

interface CollectionsNavItem {
  active: boolean;
  href: string;
  title: string;
}

interface ShopRegionLabels {
  clearAll: string;
  collections: string;
  filters: string;
  loadMore: string;
  noResults: string;
  productsShown: string;
  removeFilter: string;
  selectSort: string;
  sortBestMatches: string;
  sortDateNewToOld: string;
  sortPriceHighToLow: string;
  sortPriceLowToHigh: string;
}

// The shop page's filtering is entirely Storesynk's server-driven collection
// module: the <StoresynkCollection> wrapper server-renders the default view
// (grid, facets, count) and the client engine adopts it — no refetch, no empty
// flash. The sidebar's Collections section is plain server-rendered links —
// navigation, not a facet.
export const CollectionDetailPage = async ({
  buyerLocale,
  collection,
  handle,
  listingState,
  locale,
}: {
  /** The buyer's market from the storesynk_locale cookie — SSR renders their currency. */
  buyerLocale: I18nState | null;
  collection: Collection;
  handle: string;
  /** The URL's filters/sort/page (parseListingParams) — SSR renders the filtered view. */
  listingState: ListingSearchState;
  locale: Locale;
}) => {
  const [t, tBreadcrumb, collections] = await Promise.all([
    getTranslations("search"),
    getTranslations("collections.breadcrumb"),
    getCollections({ locale }),
  ]);

  const collectionsNav: CollectionsNavItem[] = [
    { active: handle === ALL_PRODUCTS_HANDLE, href: "/collections/all", title: t("all") },
    ...collections.map((c) => ({ active: c.handle === handle, href: c.path, title: c.title })),
  ];

  const labels: ShopRegionLabels = {
    clearAll: t("clearAll"),
    collections: t("collections"),
    filters: t("filters"),
    loadMore: t("loadMore"),
    noResults: t("noResults"),
    productsShown: t("productsShown"),
    removeFilter: t("removeFilter"),
    selectSort: t("selectSort"),
    sortBestMatches: t("sort.bestMatches"),
    sortDateNewToOld: t("sort.dateNewToOld"),
    sortPriceHighToLow: t("sort.priceHighToLow"),
    sortPriceLowToHigh: t("sort.priceLowToHigh"),
  };

  return (
    <Page className="pt-2.5 md:pt-10">
      <Container>
        <Sections className="gap-5">
          <CollectionHeader
            collection={collection}
            handle={handle}
            homeLabel={tBreadcrumb("home")}
          />
          <ShopRegion
            buyerLocale={buyerLocale}
            handle={handle === ALL_PRODUCTS_HANDLE ? null : handle}
            collectionsNav={collectionsNav}
            labels={labels}
            listingState={listingState}
          />
        </Sections>
      </Container>
    </Page>
  );
};

// The listing fetch is cached and tagged inside @storesynk/next (products,
// collections, collection-<handle>, product-<id> per listed product), so the
// Shopify webhook invalidates the server-rendered grid — no app cache scope.
const ShopRegion = ({
  buyerLocale,
  collectionsNav,
  handle,
  labels,
  listingState,
}: {
  buyerLocale: I18nState | null;
  collectionsNav: CollectionsNavItem[];
  handle: string | null;
  labels: ShopRegionLabels;
  listingState: ListingSearchState;
}) => {
  return (
    <StoresynkCollection
      handle={handle ?? undefined}
      locale={buyerLocale}
      pageSize={12}
      revalidate
      state={listingState}
      className="grid items-start gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]"
    >
      <aside className="grid content-start gap-5 lg:sticky lg:top-20">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{labels.filters}</h2>
          <clear-filters className="cursor-pointer text-sm text-foreground underline-offset-4 hover:underline [&[ss-empty]]:hidden">
            {labels.clearAll}
          </clear-filters>
        </div>

        <p className="text-sm text-muted-foreground">
          <show-result-count className="font-semibold text-foreground"></show-result-count>{" "}
          {labels.productsShown}
        </p>

        <nav
          aria-label={labels.collections}
          className="grid content-start gap-2.5 border-t border-border pt-5"
        >
          <h3 className={FACET_HEADING}>{labels.collections}</h3>
          {collectionsNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "text-sm text-muted-foreground transition-colors hover:text-foreground",
                item.active && "font-semibold text-foreground",
              )}
            >
              {item.title}
            </a>
          ))}
        </nav>

        {/* Custom swatch UX for the color facet; excluded from filter-list below. */}
        <change-filter for="color" mode="multi" className={FACET_SECTION}>
          <h3 className={FACET_HEADING}>
            <show-filter-label></show-filter-label>
          </h3>
          <div className="flex flex-wrap gap-x-2.5 gap-y-2">
            <filter-value className="grid w-12 cursor-pointer justify-items-center gap-1 [&[ss-active]_show-filter-swatch]:ring-2 [&[ss-active]_show-filter-swatch]:ring-foreground [&[ss-active]_show-filter-swatch]:ring-offset-2 [&[ss-active]_show-filter-swatch]:ring-offset-background [&[ss-active]_show-filter-title]:text-foreground">
              <show-filter-swatch className="block size-7 rounded-full border border-border"></show-filter-swatch>
              <show-filter-title className="block max-w-full truncate text-xs text-muted-foreground"></show-filter-title>
            </filter-value>
          </div>
        </change-filter>

        {/* Size as pill buttons. */}
        <change-filter for="size" mode="multi" className={FACET_SECTION}>
          <h3 className={FACET_HEADING}>
            <show-filter-label></show-filter-label>
          </h3>
          <div className="flex flex-wrap gap-2">
            <filter-value className="flex min-w-11 cursor-pointer items-center justify-center rounded-lg border border-border px-3.5 py-1.5 text-sm transition-colors hover:border-foreground [&[ss-active]]:border-foreground [&[ss-active]]:ring-1 [&[ss-active]]:ring-foreground">
              <show-filter-title></show-filter-title>
            </filter-value>
          </div>
        </change-filter>

        {/* Product type as square checkboxes. */}
        <change-filter for="filter.p.product_type" mode="multi" className={FACET_SECTION}>
          <h3 className={FACET_HEADING}>
            <show-filter-label></show-filter-label>
          </h3>
          <div className="grid gap-2.5">
            <filter-value className="block">
              <label className={CHECK_ROW}>
                <input type="checkbox" className={cn(CHECK_BOX, "rounded-sm")} />
                <show-filter-title></show-filter-title>
              </label>
            </filter-value>
          </div>
        </change-filter>

        {/* Vendor as round (radio-look) toggles. */}
        <change-filter for="filter.p.vendor" mode="multi" className={FACET_SECTION}>
          <h3 className={FACET_HEADING}>
            <show-filter-label></show-filter-label>
          </h3>
          <div className="grid gap-2.5">
            <filter-value className="block">
              <label className={CHECK_ROW}>
                <input
                  type="checkbox"
                  className={cn(
                    CHECK_BOX,
                    "rounded-full checked:border-[5px] checked:bg-background",
                  )}
                />
                <show-filter-title></show-filter-title>
              </label>
            </filter-value>
          </div>
        </change-filter>

        {/* Every remaining LIST facet (availability, tags, other options),
            zero-config with live counts. */}
        <filter-list
          except="color,size,filter.p.product_type,filter.p.vendor"
          className="grid content-start gap-5 [&[ss-empty]]:hidden"
        >
          <filter-group className={FACET_SECTION}>
            <h3 className={FACET_HEADING}>
              <show-filter-label></show-filter-label>
            </h3>
            <filter-value className="block">
              <label className={CHECK_ROW}>
                <input type="checkbox" className={cn(CHECK_BOX, "rounded-sm")} />
                <show-filter-title></show-filter-title>
                <span className="text-muted-foreground">
                  (<show-filter-count></show-filter-count>)
                </span>
              </label>
            </filter-value>
          </filter-group>
        </filter-list>
      </aside>

      <div className="grid gap-5">
        <div className="flex flex-wrap items-center gap-4">
          <active-filter-list className="flex flex-wrap gap-1.5 [&[ss-empty]]:hidden">
            <active-filter-item className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
              <show-filter-title></show-filter-title>
              <button type="button" aria-label={labels.removeFilter} className="cursor-pointer">
                ×
              </button>
            </active-filter-item>
          </active-filter-list>
          <change-sort className="ml-auto">
            <select
              aria-label={labels.selectSort}
              className="h-9 cursor-pointer rounded-md border border-input bg-transparent px-2 text-sm"
            >
              <option value="">{labels.sortBestMatches}</option>
              <option value="PRICE">{labels.sortPriceLowToHigh}</option>
              <option value="PRICE:reverse">{labels.sortPriceHighToLow}</option>
              <option value="CREATED:reverse">{labels.sortDateNewToOld}</option>
            </select>
          </change-sort>
        </div>

        <product-list className="peer grid grid-cols-2 gap-x-5 gap-y-10 transition-opacity sm:grid-cols-3 xl:grid-cols-4 [&[ss-loading]]:opacity-50">
          <storesynk-product className="grid content-start gap-2.5">
            <product-link className="block">
              <a className="grid gap-2.5">
                <show-image
                  main=""
                  className="block aspect-square overflow-hidden rounded-lg bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover"
                >
                  <img alt="" />
                </show-image>
                <span className="grid gap-1">
                  <show-title className="truncate text-sm font-medium text-foreground"></show-title>
                  <span className="font-mono text-sm tabular-nums text-foreground">
                    <show-price></show-price>{" "}
                    <show-compare-price className="text-muted-foreground line-through"></show-compare-price>
                  </span>
                </span>
              </a>
            </product-link>
          </storesynk-product>
        </product-list>
        <p className="hidden py-10 text-center text-muted-foreground peer-[[ss-empty]]:block">
          {labels.noResults}
        </p>

        <load-more className="mx-auto block cursor-pointer rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-foreground [&[ss-empty]]:hidden [&[ss-loading]]:cursor-wait [&[ss-loading]]:opacity-60">
          {labels.loadMore}
        </load-more>
      </div>
    </StoresynkCollection>
  );
};

const CollectionHeader = ({
  collection,
  handle,
  homeLabel,
}: {
  collection: Collection;
  handle: string;
  homeLabel: string;
}) => {
  const { title, description, updatedAt } = collection;

  const breadcrumbItems = [
    { name: homeLabel, path: "/" },
    { name: title, path: `/collections/${handle}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <CollectionSchema collection={{ handle, title, description, updatedAt }} />
      <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl">
          <Link href={`/collections/${handle}`}>{title}</Link>
        </h1>
        {description && <p className="mt-1 leading-6 text-muted-foreground">{description}</p>}
      </div>
    </>
  );
};
