import { StoresynkProduct, type I18nState } from "@storesynk/next";

import {
  BundleWidget,
  BuyBox,
  type DetailLabels,
  OptionGroups,
  ProductGallery,
  ProductInfo,
  ProductSummary,
} from "@/components/product/storesynk-parts";

// Bundle-focused PDP template: the compact bundle widget sits in the buy
// column, directly below the buy box (add-to-cart / Buy with Shop). It hides
// itself via [ss-empty] when the product has no live bundle.
export const StoresynkBundleDetail = async ({
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
        <BuyBox labels={labels} />
        <BundleWidget labels={labels} />
        <ProductInfo labels={labels} />
      </div>
    </StoresynkProduct>
  );
};
