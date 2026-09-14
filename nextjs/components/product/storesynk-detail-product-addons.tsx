import { StoresynkProduct, type I18nState } from "@storesynk/next";

import {
  AddonsWidget,
  BuyBox,
  type DetailLabels,
  OptionGroups,
  ProductGallery,
  ProductInfo,
  ProductSummary,
} from "@/components/product/storesynk-parts";

// Product-addons-focused PDP template: the "frequently added together"
// checkbox list sits in the buy column below the buy box, reading the host
// product's product_addons metafield + the shop-level list (the normal PDP
// placement — SSR-expanded with preselected rows ticked, adopted client-side).
// Deliberately NO `revalidate`: revalidation forces a live refetch of adopted
// widgets, and e2e/product-addons.spec.ts asserts adoption is total (zero
// client refetches). Ticked rows ride the BuyBox's own <add-to-cart>. The
// widget hides itself via [ss-empty] when the product has no live offer.
export const StoresynkProductAddonsDetail = async ({
  buyerLocale,
  handle,
  labels,
}: {
  buyerLocale?: I18nState | null;
  handle: string;
  labels: DetailLabels;
}) => {
  return (
    <StoresynkProduct handle={handle} locale={buyerLocale} className="grid gap-10 lg:grid-cols-10">
      <ProductGallery />

      <div className="grid gap-5 self-start lg:col-span-4">
        <ProductSummary />
        <OptionGroups />
        <BuyBox labels={labels} />
        <AddonsWidget />
        <ProductInfo labels={labels} />
      </div>
    </StoresynkProduct>
  );
};
