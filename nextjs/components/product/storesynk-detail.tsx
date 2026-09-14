import { StoresynkProduct, StoresynkProductJsonLd, type I18nState } from "@storesynk/next";

import {
  AddonsWidget,
  BundleWidget,
  BuyBox,
  type DetailLabels,
  MixMatchWidget,
  OptionGroups,
  ProductGallery,
  ProductInfo,
  ProductSummary,
  PurchaseOptions,
  VolumeDiscount,
} from "@/components/product/storesynk-parts";
import { shopConfig } from "@/shop.config";

// The Storesynk PDP. Children are static host elements (server-filled, adopted by the
// client runtime — never reconciled by React); interactivity comes from the elements.
// Data fetches are cached and tagged inside @storesynk/next (products,
// product-<handle>, product-<numericId>), so the Shopify webhook invalidates them
// without an app-authored cache scope. selectedOptions comes from the route's
// searchParams — the exact variant is server-rendered; without it the default variant
// renders and syncUrl mirrors option clicks into the query string.
// Every Storesynk app offer widget is in the slot: each hides itself via [ss-empty]
// when the product has no live offer, so a product created in the app shows its
// offer here without a template change.
export const StoresynkProductDetail = async ({
  buyerLocale,
  handle,
  labels,
  selectedOptions,
}: {
  /** The buyer's market cookie — cached data is keyed per market inside the package. */
  buyerLocale?: I18nState | null;
  handle: string;
  labels: DetailLabels;
  selectedOptions?: Record<string, string> | null;
}) => {
  return (
    <>
      <StoresynkProductJsonLd
        handle={handle}
        url={`${shopConfig.site.url}/products/${handle}`}
        variantUrls
      />
      <StoresynkProduct
        handle={handle}
        locale={buyerLocale}
        revalidate
        syncUrl
        selectedOptions={selectedOptions}
        className="grid gap-10 lg:grid-cols-10"
      >
        <ProductGallery />

        <div className="grid gap-5 self-start lg:sticky lg:top-10 lg:col-span-4">
          <ProductSummary />
          <OptionGroups />
          <PurchaseOptions labels={labels} />
          <div className="grid gap-2.5 [&:has(storesynk-volume-discount[ss-empty])]:hidden">
            <h2 className="text-sm font-medium">{labels.buyMoreSaveMore}</h2>
            <VolumeDiscount labels={labels} />
          </div>
          <BuyBox labels={labels} />
          <BundleWidget labels={labels} />
          <MixMatchWidget labels={labels} />
          <AddonsWidget />
          <ProductInfo labels={labels} />
        </div>
      </StoresynkProduct>
    </>
  );
};
