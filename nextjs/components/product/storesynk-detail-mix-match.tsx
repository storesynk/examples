import { StoresynkProduct, type I18nState } from "@storesynk/next";

import {
  BuyBox,
  type DetailLabels,
  MixMatchWidget,
  OptionGroups,
  ProductGallery,
  ProductInfo,
  ProductSummary,
} from "@/components/product/storesynk-parts";

// Mix & Match-focused PDP template: the build-your-own-box widget sits in the
// buy column below the buy box, reading the host product's mix_match
// metafield (the normal PDP placement — SSR-expanded, adopted client-side).
// Deliberately NO `revalidate`: revalidation forces a live refetch of adopted
// widgets, and e2e/mix-match.spec.ts asserts adoption is total (zero client
// refetches). The widget hides itself via [ss-empty] when the product has no
// live mix & match bundle.
export const StoresynkMixMatchDetail = async ({
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
        <MixMatchWidget labels={labels} />
        <ProductInfo labels={labels} />
      </div>
    </StoresynkProduct>
  );
};
