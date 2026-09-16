import { shopConfig } from "@/shop.config";

export interface DetailLabels {
  addBoxToCart: string;
  addToBox: string;
  addToCart: string;
  barcode: string;
  boxEmpty: string;
  buyMoreSaveMore: string;
  buyWithShop: string;
  care: string;
  freeShippingUnlocked: string;
  material: string;
  oneTimePurchase: string;
  outOfStock: string;
  pickRange: string;
  purchaseOptions: string;
  quantity: string;
  removeFromBox: string;
  sectionMet: string;
  sectionNeeded: string;
  sku: string;
  stock: string;
  subscribeAndSave: string;
  yourBox: string;
  youSave: string;
}

export const detailLabels = (t: (key: keyof DetailLabels) => string): DetailLabels => ({
  addBoxToCart: t("addBoxToCart"),
  addToBox: t("addToBox"),
  addToCart: t("addToCart"),
  barcode: t("barcode"),
  boxEmpty: t("boxEmpty"),
  buyMoreSaveMore: t("buyMoreSaveMore"),
  buyWithShop: t("buyWithShop"),
  care: t("care"),
  freeShippingUnlocked: t("freeShippingUnlocked"),
  material: t("material"),
  oneTimePurchase: t("oneTimePurchase"),
  outOfStock: t("outOfStock"),
  pickRange: t("pickRange"),
  purchaseOptions: t("purchaseOptions"),
  quantity: t("quantity"),
  removeFromBox: t("removeFromBox"),
  sectionMet: t("sectionMet"),
  sectionNeeded: t("sectionNeeded"),
  sku: t("sku"),
  stock: t("stock"),
  subscribeAndSave: t("subscribeAndSave"),
  yourBox: t("yourBox"),
  youSave: t("youSave"),
});

interface LabeledProps {
  labels: DetailLabels;
}

// Every component below emits static host elements only (no client components,
// no handlers) — they render inside <StoresynkProduct>, whose children are
// stringified, server-filled, and adopted by the engine, never reconciled by
// React. Keep them sync: renderToString does not await async components.

export const ProductGallery = () => (
  <div className="grid gap-2.5 lg:col-span-6">
    <show-media
      main=""
      sizes="(max-width: 1024px) 100vw, 60vw"
      className="relative block aspect-square overflow-hidden rounded-lg bg-muted"
    >
      <img alt="" className="h-full w-full object-cover" />
    </show-media>
    {/* Index-less <show-thumbnail> is the template: self-clones one per media
        item, hides entirely when there's <=1 media. */}
    <div className="flex flex-wrap gap-2">
      <show-thumbnail className="block size-18 cursor-pointer overflow-hidden rounded-md border border-border bg-muted transition-colors hover:border-foreground [&[ss-active]]:border-foreground [&[ss-active]]:ring-1 [&[ss-active]]:ring-foreground">
        <img alt="" className="h-full w-full object-cover" />
      </show-thumbnail>
    </div>
  </div>
);

export const ProductSummary = () => (
  <div className="grid gap-2.5">
    <show-vendor className="text-xs font-medium uppercase tracking-wide text-muted-foreground"></show-vendor>
    <h1 className="text-2xl text-foreground sm:text-3xl">
      <show-title></show-title>
    </h1>
    <p className="flex items-center gap-2 font-mono text-xl tabular-nums text-foreground">
      <show-price></show-price>{" "}
      <show-compare-price className="text-base text-muted-foreground line-through"></show-compare-price>
      <show-sale-badge
        format="percentage"
        className="rounded-full bg-foreground px-2.5 py-0.5 font-sans text-xs font-medium text-background"
      ></show-sale-badge>
    </p>
  </div>
);

const OptionGroup = ({ group }: { group: string }) => (
  <change-option group={group} className="grid gap-2.5">
    <show-option-label className="text-xs font-medium uppercase tracking-wide text-muted-foreground"></show-option-label>
    <div className="flex flex-wrap gap-2">
      <option-value className="flex min-w-11 cursor-pointer items-center justify-center rounded-full border border-border px-3.5 py-1.5 text-sm transition-colors hover:border-foreground [&[ss-active]]:border-foreground [&[ss-active]]:bg-foreground [&[ss-active]]:text-background [&[ss-unavailable]]:cursor-not-allowed [&[ss-unavailable]]:text-muted-foreground [&[ss-unavailable]]:line-through [&[ss-unavailable]]:opacity-50">
        <show-option-title></show-option-title>
      </option-value>
    </div>
  </change-option>
);

// Templates serve MANY products -> positional group=, never a hardcoded option
// name. Three blocks cover every product; extras self-hide.
export const OptionGroups = () => (
  <>
    <OptionGroup group="1" />
    <OptionGroup group="2" />
    <OptionGroup group="3" />
  </>
);

// Subscriptions: both pickers hide via [ss-empty] on plan-less products.
export const PurchaseOptions = ({ labels }: LabeledProps) => (
  <>
    <change-purchase-option className="grid grid-cols-2 gap-2 [&[ss-empty]]:hidden">
      <purchase-option
        value="single"
        className="flex cursor-pointer items-center justify-center rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-foreground [&[ss-active]]:border-foreground [&[ss-active]]:ring-1 [&[ss-active]]:ring-foreground"
      >
        {labels.oneTimePurchase}
      </purchase-option>
      <purchase-option
        value="recurring"
        className="flex cursor-pointer items-center justify-center rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-foreground [&[ss-active]]:border-foreground [&[ss-active]]:ring-1 [&[ss-active]]:ring-foreground"
      >
        {labels.subscribeAndSave}
      </purchase-option>
    </change-purchase-option>
    <change-selling-plan className="grid gap-1.5 [&[ss-empty]]:hidden">
      <selling-plan-option className="flex cursor-pointer items-center justify-between rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-foreground [&[ss-active]]:border-foreground [&[ss-active]]:ring-1 [&[ss-active]]:ring-foreground">
        <show-selling-plan-name></show-selling-plan-name>
        <show-selling-plan-price className="font-mono tabular-nums"></show-selling-plan-price>
      </selling-plan-option>
    </change-selling-plan>
  </>
);

const CTA_BUTTON_CLASS =
  "h-11 w-full cursor-pointer rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 group-[[ss-loading]]:cursor-wait group-[[ss-loading]]:opacity-60 group-[[ss-out-of-stock]]:cursor-not-allowed group-[[ss-out-of-stock]]:opacity-50 group-[[ss-unavailable]]:cursor-not-allowed group-[[ss-unavailable]]:opacity-50";

export const BuyBox = ({ labels }: LabeledProps) => (
  <div className="grid gap-2.5">
    <div className="flex gap-2.5">
      {shopConfig.pdp.quantityPicker.enabled ? (
        <change-quantity className="flex h-11 items-center overflow-hidden rounded-md border border-border">
          <decrease-quantity className="flex h-full w-10 cursor-pointer items-center justify-center text-lg hover:bg-muted">
            −
          </decrease-quantity>
          <input-quantity>
            <input
              aria-label={labels.quantity}
              className="h-full w-12 border-x border-border text-center text-sm tabular-nums"
            />
          </input-quantity>
          <increase-quantity className="flex h-full w-10 cursor-pointer items-center justify-center text-lg hover:bg-muted">
            +
          </increase-quantity>
        </change-quantity>
      ) : null}
      <add-to-cart
        className="group block flex-1"
        text-out-of-stock={labels.outOfStock}
        text-unavailable={labels.outOfStock}
      >
        <button type="button" className={CTA_BUTTON_CLASS}>
          {labels.addToCart}
        </button>
      </add-to-cart>
    </div>
    {shopConfig.pdp.quantityPicker.enabled ? (
      <p className="text-xs text-muted-foreground">
        {labels.quantity}: <show-quantity></show-quantity>
      </p>
    ) : null}
    {shopConfig.pdp.buyWithShop.enabled ? (
      <buy-now
        payment="shop-pay"
        className="group block"
        text-out-of-stock={labels.outOfStock}
        text-unavailable={labels.outOfStock}
      >
        <button
          type="button"
          className="h-11 w-full cursor-pointer rounded-md bg-[#5a31f4] px-5 text-sm font-medium text-white transition-opacity hover:opacity-90 group-[[ss-loading]]:cursor-wait group-[[ss-loading]]:opacity-60 group-[[ss-out-of-stock]]:cursor-not-allowed group-[[ss-out-of-stock]]:opacity-50 group-[[ss-unavailable]]:cursor-not-allowed group-[[ss-unavailable]]:opacity-50"
        >
          {labels.buyWithShop} <span className="font-semibold">Shop</span>
        </button>
      </buy-now>
    ) : null}
  </div>
);

// Volume discount ("Buy more, Save more"): tier rows are an ARIA radio group;
// prices are advisory (the app's Discount Function applies the real percentage
// at checkout). Hidden when no live discount targets this product. The app
// namespace rides in on <storesynk-store>.
export const VolumeDiscount = ({ labels }: LabeledProps) => (
  <storesynk-volume-discount className="block [&[ss-empty]]:hidden">
    <div className="grid gap-2.5 rounded-lg border border-border p-4">
      <show-volume-discount-title className="text-sm font-medium"></show-volume-discount-title>
      <volume-tier-list className="grid gap-1.5">
        <volume-tier className="flex cursor-pointer items-center justify-between rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-foreground [&[ss-active]]:border-foreground [&[ss-active]]:ring-1 [&[ss-active]]:ring-foreground">
          <span className="flex items-center gap-2">
            <show-tier-title className="font-medium"></show-tier-title>
            <show-tier-label className="text-xs text-muted-foreground"></show-tier-label>
            <show-tier-badge className="rounded-full bg-foreground px-2 py-0.5 text-[10px] text-background [&[ss-empty]]:hidden"></show-tier-badge>
          </span>
          <span className="font-mono tabular-nums">
            <show-tier-original-price className="mr-1 text-xs text-muted-foreground line-through"></show-tier-original-price>
            <show-tier-price></show-tier-price>
          </span>
        </volume-tier>
      </volume-tier-list>
      <add-volume-to-cart
        className="group block"
        text-out-of-stock={labels.outOfStock}
        text-unavailable={labels.outOfStock}
      >
        <button type="button" className={CTA_BUTTON_CLASS}>
          {labels.addToCart}
        </button>
      </add-volume-to-cart>
    </div>
  </storesynk-volume-discount>
);

// Bundles, compact: one <bundle-offer> clone per live bundle; member cards are
// full storesynk-products rendered as thumbnail rows (standard displayers +
// native-select option pickers), sized for the buy column. The add button
// sends ONE multi-line updateCart; the app's Cart Transform merges it into a
// single discounted bundle line.
export const BundleWidget = ({ labels }: LabeledProps) => (
  <storesynk-bundle className="block [&[ss-empty]]:hidden">
    <bundle-offer className="grid gap-4 rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-baseline gap-2">
        <show-bundle-title className="text-sm font-semibold"></show-bundle-title>
        <show-bundle-percentage className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-medium text-background [&[ss-empty]]:hidden"></show-bundle-percentage>
      </div>
      <bundle-member-list className="grid gap-2.5">
        <storesynk-product className="block">
          <div className="grid gap-1.5">
            <product-link className="block">
              <a className="flex items-center gap-2.5">
                <show-image className="block size-12 shrink-0 overflow-hidden rounded-md bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
                  <img alt="" className="h-full w-full object-cover" />
                </show-image>
                <span className="min-w-0 flex-1">
                  <show-title className="block truncate text-sm"></show-title>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    <show-price></show-price> <show-member-quantity></show-member-quantity>
                  </span>
                </span>
              </a>
            </product-link>
            {/* The empty <option> is the template the engine clones per value — a bare <select> stays empty. */}
            <change-option group="1" className="block [&[ss-empty]]:hidden">
              <select className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs">
                <option></option>
              </select>
            </change-option>
            <change-option group="2" className="block [&[ss-empty]]:hidden">
              <select className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs">
                <option></option>
              </select>
            </change-option>
            <change-option group="3" className="block [&[ss-empty]]:hidden">
              <select className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs">
                <option></option>
              </select>
            </change-option>
          </div>
        </storesynk-product>
      </bundle-member-list>
      <div className="grid gap-2">
        <span className="font-mono text-sm tabular-nums">
          <show-bundle-original-total className="mr-1 text-xs text-muted-foreground line-through"></show-bundle-original-total>
          <show-bundle-total className="font-medium"></show-bundle-total>
          <show-bundle-savings className="ml-1 text-xs text-muted-foreground [&[ss-empty]]:hidden"></show-bundle-savings>
        </span>
        <add-bundle-to-cart
          className="group block"
          text-out-of-stock={labels.outOfStock}
          text-unavailable={labels.outOfStock}
        >
          <button type="button" className={CTA_BUTTON_CLASS}>
            {labels.addToCart}
          </button>
        </add-bundle-to-cart>
      </div>
    </bundle-offer>
  </storesynk-bundle>
);

export const ProductInfo = ({ labels }: LabeledProps) => (
  <>
    <show-description className="grid gap-2 text-sm leading-6 text-muted-foreground"></show-description>

    {/* Scalar metafields (namespace defaults to "custom"); each wrapper hides
        its whole label+value row when the product lacks the field. */}
    <div className="grid gap-1 text-sm text-muted-foreground">
      <metafield-wrapper className="block [&[ss-empty]]:hidden">
        <strong className="text-foreground">{labels.care}:</strong>{" "}
        <show-metafield field="care"></show-metafield>
      </metafield-wrapper>
      <metafield-wrapper className="block [&[ss-empty]]:hidden">
        <strong className="text-foreground">{labels.material}:</strong>{" "}
        <show-metafield field="material"></show-metafield>
      </metafield-wrapper>
      {/* Variant-scoped rows: the label span hides with its displayer via :has(). */}
      <p className="[&:has([ss-empty])]:hidden">
        <strong className="text-foreground">{labels.sku}:</strong>{" "}
        <show-sku className="font-mono"></show-sku>
      </p>
      <p className="[&:has([ss-empty])]:hidden">
        <strong className="text-foreground">{labels.barcode}:</strong>{" "}
        <show-barcode className="font-mono"></show-barcode>
      </p>
      <p className="[&:has([ss-empty])]:hidden">
        <strong className="text-foreground">{labels.stock}:</strong>{" "}
        <show-stock hide-when-zero="" className="font-mono tabular-nums"></show-stock>
      </p>
    </div>
  </>
);

// Mix & Match ("build your own box"): the canonical accordion + steppers +
// summary-bar authoring from the component reference. One <mix-match-offer>
// clone per live bundle; each section is a disclosure (toggle-section header,
// progress bar, pool panel) whose pool cards are full storesynk-products with
// an Add button that swaps for a stepper once picked ([ss-selected] lands on
// the card's clone root — here the storesynk-product itself). The CTA sends
// ONE multi-line updateCart stamped with the _ss_mm / _ss_mm_group /
// _ss_mm_section line attributes the app's Discount Function groups on; all
// prices shown are advisory. Hides itself via [ss-empty] when the product has
// no live mix & match bundle (or no app namespace). The steppers are
// icon-only, so each nested button carries an explicit aria-label (SSK-501).
export const MixMatchWidget = ({ labels }: LabeledProps) => (
  <storesynk-mix-match className="block [&[ss-empty]]:hidden">
    <mix-match-offer className="grid gap-4 rounded-lg border border-border p-4">
      <header className="flex flex-wrap items-baseline gap-2">
        <show-mix-match-title className="text-sm font-semibold"></show-mix-match-title>
        <show-mix-match-tier-hint className="text-xs text-muted-foreground [&[ss-empty]]:hidden"></show-mix-match-tier-hint>
      </header>

      <mix-match-section-list className="grid gap-8">
        <mix-match-section className="relative grid gap-2 rounded-lg border border-border p-3 transition-colors [&[ss-open]]:border-foreground">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-7 left-1/2 flex size-6 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-background text-sm font-medium text-muted-foreground [mix-match-section:first-of-type_&]:hidden"
          >
            +
          </span>
          <toggle-section className="block">
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-2.5 text-left"
            >
              <show-section-image className="block size-10 shrink-0 overflow-hidden rounded-md bg-muted [&[ss-empty]]:hidden [&_img]:h-full [&_img]:w-full [&_img]:object-cover"></show-section-image>
              <span className="min-w-0 flex-1">
                <show-section-title className="block truncate text-sm font-medium"></show-section-title>
                <show-section-requirement className="block text-xs text-muted-foreground"></show-section-requirement>
              </span>
              <span
                aria-hidden="true"
                className="shrink-0 text-lg leading-none text-muted-foreground transition-transform duration-200 [mix-match-section[ss-open]_&]:rotate-90"
              >
                &rsaquo;
              </span>
              <show-section-count className="rounded-full bg-foreground px-2 py-0.5 font-mono text-[10px] tabular-nums text-background [&[ss-empty]]:hidden"></show-section-count>
            </button>
          </toggle-section>
          {/* Fill width rides the engine's --ss-progress custom property (0..1). */}
          <show-section-progress className="block h-1 overflow-hidden rounded-full bg-muted opacity-[calc(min(var(--ss-progress,0)*99,1))] transition-opacity">
            <i className="block h-full w-[calc(var(--ss-progress,0)*100%)] rounded-full bg-foreground transition-[width]"></i>
          </show-section-progress>

          {/* The accordion panel: the engine toggles native `hidden` while
              collapsed — never force `display` on it unconditionally. */}
          <mix-match-item-list className="grid gap-2.5">
            <storesynk-product className="group block">
              <div className="flex items-start gap-2.5 rounded-md border border-border p-2 transition-colors group-[[ss-selected]]:border-foreground">
                <show-image className="block size-12 shrink-0 overflow-hidden rounded-md bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
                  <img alt="" className="h-full w-full object-cover" />
                </show-image>
                <span className="min-w-0 flex-1">
                  <show-title className="block truncate text-sm"></show-title>
                  <show-price className="font-mono text-xs tabular-nums text-muted-foreground"></show-price>
                  {/* The nested <option> is the template the engine clones per value. */}
                  <change-option group="1" className="mt-1 block [&[ss-empty]]:hidden">
                    <select className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs">
                      <option>Choose</option>
                    </select>
                  </change-option>
                </span>
                <add-mix-match-item className="block self-start group-[[ss-selected]]:hidden [&[ss-max]]:opacity-40 [&[ss-out-of-stock]]:opacity-40 [&[ss-unavailable]]:opacity-40">
                  <button
                    type="button"
                    className="h-8 cursor-pointer rounded-md bg-foreground px-3 text-xs font-medium text-background"
                  >
                    {labels.addToBox}
                  </button>
                </add-mix-match-item>
                <div className="hidden items-center gap-1 self-start group-[[ss-selected]]:flex">
                  <decrease-mix-match-item className="block">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-border hover:bg-muted"
                    >
                      −
                    </button>
                  </decrease-mix-match-item>
                  <show-item-quantity className="min-w-6 text-center font-mono text-xs tabular-nums"></show-item-quantity>
                  <increase-mix-match-item className="block [&[ss-max]]:opacity-40">
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-border hover:bg-muted"
                    >
                      +
                    </button>
                  </increase-mix-match-item>
                  <remove-mix-match-item className="block">
                    <button
                      type="button"
                      aria-label="Remove item"
                      className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-border hover:bg-muted"
                    >
                      ×
                    </button>
                  </remove-mix-match-item>
                </div>
              </div>
            </storesynk-product>
          </mix-match-item-list>
        </mix-match-section>
      </mix-match-section-list>

      <footer className="grid gap-2">
        {/* Picked-items strip: max 4 thumbnails, then a "+N" overflow chip. */}
        <mix-match-selection-list
          max="4"
          className="flex items-center gap-1.5 [&[ss-empty]]:hidden"
        >
          <span className="relative block size-9 overflow-hidden rounded-md border border-border bg-muted">
            <show-pick-image className="block h-full w-full [&_img]:h-full [&_img]:w-full [&_img]:object-cover"></show-pick-image>
            <show-pick-quantity className="absolute right-0 bottom-0 bg-foreground px-1 font-mono text-[9px] tabular-nums text-background [&[ss-empty]]:hidden"></show-pick-quantity>
          </span>
          <show-selection-overflow className="text-xs text-muted-foreground [&[ss-empty]]:hidden"></show-selection-overflow>
        </mix-match-selection-list>
        <span className="font-mono text-sm tabular-nums">
          <show-mix-match-original-total className="mr-1 text-xs text-muted-foreground line-through"></show-mix-match-original-total>
          <show-mix-match-total className="font-medium"></show-mix-match-total>
        </span>
        <p className="text-xs text-muted-foreground [&:has([ss-empty])]:hidden">
          You save{" "}
          <show-mix-match-savings className="font-medium text-foreground"></show-mix-match-savings>
        </p>
        <show-mix-match-free-shipping hidden className="text-xs font-medium">
          Free shipping unlocked!
        </show-mix-match-free-shipping>
        <add-mix-match-to-cart className="group block">
          <button
            type="button"
            className={`${CTA_BUTTON_CLASS} group-[[ss-incomplete]]:cursor-not-allowed group-[[ss-incomplete]]:opacity-50`}
          >
            Add
          </button>
        </add-mix-match-to-cart>
      </footer>
    </mix-match-offer>
  </storesynk-mix-match>
);

// Mix & Match, builder layout ("build your own box" as the whole page): flat
// section lists on the left, a sticky "Your box" summary on the right.
// `reveal="all"` keeps every section open from the start (no accordion, so no
// <toggle-section>); the other modes are the default accordion (attribute
// absent) and "progressive" (later sections stay hidden until reached).
export const MixMatchBuilder = ({ labels }: LabeledProps) => (
  <storesynk-mix-match className="block [&[ss-empty]]:hidden">
    <mix-match-offer className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-14">
      <show-mix-match-title className="sr-only"></show-mix-match-title>

      <mix-match-section-list reveal="all" className="grid min-w-0 gap-10">
        <mix-match-section className="group/section block">
          <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-foreground pb-2">
            <show-section-title className="text-xl sm:text-2xl"></show-section-title>
            <show-section-requirement
              text={labels.pickRange}
              className="text-xs text-muted-foreground"
            ></show-section-requirement>
            <span className="ml-auto flex items-baseline gap-1 text-xs font-medium tabular-nums text-muted-foreground group-[[ss-met]]/section:text-foreground [&:has(>show-section-count[ss-empty])]:before:content-['0']">
              <show-section-count></show-section-count>
              <show-section-requirement
                text={labels.sectionNeeded}
                className="group-[[ss-met]]/section:hidden"
              ></show-section-requirement>
              <show-section-requirement
                text={labels.sectionMet}
                className="hidden group-[[ss-met]]/section:inline"
              ></show-section-requirement>
            </span>
          </header>

          <mix-match-item-list className="block">
            <storesynk-product className="group grid grid-cols-[3rem_minmax(0,1fr)_auto_auto] items-center gap-x-4 border-b border-border py-3 text-sm">
              <show-image className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted [&_img]:max-h-[86%] [&_img]:max-w-[86%] [&_img]:object-contain">
                <img alt="" />
              </show-image>
              <span className="grid min-w-0 gap-1">
                <show-title className="truncate font-medium leading-tight"></show-title>
                {/* The nested <option> is the template the engine clones per value. */}
                <change-option group="1" className="block [&[ss-empty]]:hidden">
                  <select className="h-8 max-w-40 rounded-md border border-border bg-background px-2 text-xs">
                    <option>Choose</option>
                  </select>
                </change-option>
              </span>
              <show-price className="justify-self-end font-mono tabular-nums"></show-price>
              <add-mix-match-item className="block group-[[ss-selected]]:hidden [&[ss-max]]:opacity-40 [&[ss-out-of-stock]]:opacity-40 [&[ss-unavailable]]:opacity-40">
                <button
                  type="button"
                  className="h-9 min-w-24 cursor-pointer rounded-full border border-border px-4 text-xs font-medium uppercase tracking-wide transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                >
                  {labels.addToBox}
                </button>
              </add-mix-match-item>
              <div className="hidden h-9 items-center overflow-hidden rounded-full border border-foreground group-[[ss-selected]]:flex">
                <decrease-mix-match-item className="block">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    className="flex size-9 cursor-pointer items-center justify-center text-base leading-none transition-colors hover:bg-muted"
                  >
                    −
                  </button>
                </decrease-mix-match-item>
                <show-item-quantity className="flex h-full min-w-9 items-center justify-center bg-foreground px-1 font-mono text-xs tabular-nums text-background"></show-item-quantity>
                <increase-mix-match-item className="block [&[ss-max]]:opacity-40">
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    className="flex size-9 cursor-pointer items-center justify-center text-base leading-none transition-colors hover:bg-muted"
                  >
                    +
                  </button>
                </increase-mix-match-item>
              </div>
            </storesynk-product>
          </mix-match-item-list>
        </mix-match-section>
      </mix-match-section-list>

      <aside
        aria-label={labels.yourBox}
        className="grid gap-4 rounded-lg border border-border bg-muted/40 p-5 lg:sticky lg:top-10"
      >
        <span className="text-lg">{labels.yourBox}</span>
        <mix-match-selection-list max="6" className="grid grid-cols-3 gap-2 [&[ss-empty]]:hidden">
          <span className="relative block aspect-square rounded-md border border-border bg-background">
            <show-pick-image className="block h-full w-full overflow-hidden rounded-md [&_img]:h-full [&_img]:w-full [&_img]:object-contain [&_img]:p-1.5"></show-pick-image>
            <show-pick-quantity className="absolute right-1 bottom-1 rounded-full bg-foreground px-1.5 font-mono text-[10px] tabular-nums text-background [&[ss-empty]]:hidden"></show-pick-quantity>
            {/* Per-pick remove: the engine's <remove-pick> runs the same reducer as the pool card's stepper. */}
            <remove-pick className="absolute -top-1.5 -right-1.5 block">
              <button
                type="button"
                aria-label={labels.removeFromBox}
                className="flex size-5 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-xs leading-none transition-colors hover:bg-foreground hover:text-background"
              >
                ×
              </button>
            </remove-pick>
          </span>
          <show-selection-overflow className="flex aspect-square items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground [&[ss-empty]]:hidden"></show-selection-overflow>
        </mix-match-selection-list>
        <p className="hidden text-xs text-muted-foreground [mix-match-selection-list[ss-empty]+&]:block">
          {labels.boxEmpty}
        </p>
        <show-mix-match-tier-hint className="text-xs text-muted-foreground [&[ss-empty]]:hidden"></show-mix-match-tier-hint>

        <div className="grid gap-2.5 border-t border-border pt-4">
          <span className="flex flex-wrap items-baseline gap-x-3 font-mono tabular-nums [&:has(>show-mix-match-total[ss-empty])]:hidden">
            <show-mix-match-original-total className="text-sm text-muted-foreground line-through [&[ss-empty]]:hidden"></show-mix-match-original-total>
            <show-mix-match-total className="text-3xl"></show-mix-match-total>
          </span>
          <p className="text-xs text-muted-foreground [&:has([ss-empty])]:hidden">
            {labels.youSave}{" "}
            <show-mix-match-savings className="font-medium text-foreground"></show-mix-match-savings>
          </p>
          <show-mix-match-free-shipping hidden className="text-xs font-medium">
            {labels.freeShippingUnlocked}
          </show-mix-match-free-shipping>
          <add-mix-match-to-cart className="group block">
            <button
              type="button"
              className={`${CTA_BUTTON_CLASS} group-[[ss-incomplete]]:cursor-not-allowed group-[[ss-incomplete]]:opacity-50`}
            >
              {labels.addBoxToCart}
            </button>
          </add-mix-match-to-cart>
        </div>
      </aside>
    </mix-match-offer>
  </storesynk-mix-match>
);

// Product add-ons ("frequently added together"): the canonical checkbox-list
// authoring from the component reference. The widget clones its per-offer
// template ONCE for the one live offer (overlap rule: products > collections >
// all); each row card is a full storesynk-product fed via provideProduct, with
// a native-first <select-addon> checkbox ([ss-selected] lands on the card's
// clone root — here the storesynk-product itself) and advisory show-addon-*
// price deltas. There is NO dedicated add button: ticked rows ride the page's
// own <add-to-cart> as ONE multi-line updateCart stamped with the _ss_addons /
// _ss_addons_host line attributes the app's Discount Function validates and
// prices at checkout. Hides itself via [ss-empty] when no live offer applies
// (or no app namespace). Preselected rows arrive already ticked, client + SSR.
export const AddonsWidget = () => (
  <storesynk-addons className="block [&[ss-empty]]:hidden">
    <div className="grid gap-3 rounded-lg border border-border p-4">
      <header className="grid gap-0.5">
        <show-addons-title className="text-sm font-semibold"></show-addons-title>
        <show-addons-subtitle className="text-xs text-muted-foreground [&[ss-empty]]:hidden"></show-addons-subtitle>
      </header>

      <addon-list className="grid gap-2.5">
        <storesynk-product className="group block">
          <div className="flex items-start gap-2.5 rounded-md border border-border p-2 transition-colors group-[[ss-selected]]:border-foreground">
            <select-addon className="block self-center [&[ss-out-of-stock]_input]:cursor-not-allowed [&[ss-out-of-stock]_input]:opacity-40 [&[ss-unavailable]_input]:cursor-not-allowed [&[ss-unavailable]_input]:opacity-40">
              <input
                type="checkbox"
                aria-label="Add to order"
                className="size-4 cursor-pointer accent-foreground"
              />
            </select-addon>
            <show-image className="block size-12 shrink-0 overflow-hidden rounded-md bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
              <img alt="" className="h-full w-full object-cover" />
            </show-image>
            <span className="min-w-0 flex-1">
              <show-title className="block truncate text-sm"></show-title>
              <span className="flex items-baseline gap-1 font-mono text-xs tabular-nums">
                <show-addon-original-price className="text-muted-foreground line-through [&[ss-empty]]:hidden"></show-addon-original-price>
                <show-addon-price className="text-foreground [&[ss-empty]]:hidden"></show-addon-price>
              </span>
              {/* The nested <option> is the template the engine clones per value. */}
              <change-option group="1" className="mt-1 block [&[ss-empty]]:hidden">
                <select className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs">
                  <option>Choose</option>
                </select>
              </change-option>
            </span>
          </div>
        </storesynk-product>
      </addon-list>
    </div>
  </storesynk-addons>
);
