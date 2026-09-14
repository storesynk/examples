import { StoresynkProduct, type I18nState } from "@storesynk/next";

import {
  BuyBox,
  type DetailLabels,
  OptionGroups,
  ProductGallery,
  ProductInfo,
  ProductSummary,
  VolumeDiscount,
} from "@/components/product/storesynk-parts";

// Volume-discount-focused PDP template: the tier picker leads the buy column
// under its own heading, with the standard buy box below it as the single-unit
// path. Heading and widget hide together when no live discount targets the
// product (:has on the wrapper).
export const StoresynkVolumeDetail = async ({
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
        <div className="grid gap-2.5 [&:has(storesynk-volume-discount[ss-empty])]:hidden">
          <h2 className="text-sm font-medium">{labels.buyMoreSaveMore}</h2>
          <VolumeDiscount labels={labels} />
        </div>
        <BuyBox labels={labels} />
        <ProductInfo labels={labels} />
      </div>
    </StoresynkProduct>
  );
};
