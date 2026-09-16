import { StoresynkProduct, type I18nState } from "@storesynk/next";

import { type DetailLabels, MixMatchBuilder } from "@/components/product/storesynk-parts";

// Mix & Match-focused PDP template: the host product IS the box, so there is no
// gallery or buy box — a heading, the description, then the builder (flat
// section lists + sticky "Your box" summary) reading the host's mix_match
// metafield (SSR-expanded, adopted client-side). Deliberately NO `revalidate`:
// revalidation forces a live refetch of adopted widgets, and
// e2e/mix-match.spec.ts asserts adoption is total (zero client refetches).
// The widget hides itself via [ss-empty] when the product has no live bundle.
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
    <StoresynkProduct handle={handle} locale={buyerLocale} className="grid gap-10">
      <div className="grid max-w-3xl gap-2.5">
        <show-vendor className="text-xs font-medium uppercase tracking-wide text-muted-foreground"></show-vendor>
        <h1 className="text-2xl text-foreground sm:text-3xl">
          <show-title></show-title>
        </h1>
        <show-description className="grid gap-2 text-sm leading-6 text-muted-foreground"></show-description>
      </div>

      <MixMatchBuilder labels={labels} />
    </StoresynkProduct>
  );
};
