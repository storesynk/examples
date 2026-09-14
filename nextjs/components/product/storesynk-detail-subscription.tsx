import { StoresynkProduct, type I18nState } from "@storesynk/next";

import {
  BuyBox,
  type DetailLabels,
  OptionGroups,
  ProductGallery,
  ProductInfo,
  ProductSummary,
  PurchaseOptions,
} from "@/components/product/storesynk-parts";

// Subscription-focused PDP template: the purchase-option toggle and
// selling-plan picker are the featured decision, framed as their own card.
// Both pickers self-hide on plan-less products, collapsing the card body.
export const StoresynkSubscriptionDetail = async ({
  buyerLocale,
  handle,
  labels,
}: {
  buyerLocale?: I18nState | null;
  handle: string;
  labels: DetailLabels;
}) => {
  return (
    <StoresynkProduct
      handle={handle}
      locale={buyerLocale}
      revalidate
      className="grid gap-10 lg:grid-cols-10"
    >
      <ProductGallery />

      <div className="grid gap-5 self-start lg:sticky lg:top-10 lg:col-span-4">
        <ProductSummary />
        <OptionGroups />
        <div className="grid gap-2.5 rounded-lg border border-border p-4">
          <h2 className="text-sm font-medium">{labels.purchaseOptions}</h2>
          <PurchaseOptions labels={labels} />
        </div>
        <BuyBox labels={labels} />
        <ProductInfo labels={labels} />
      </div>
    </StoresynkProduct>
  );
};
