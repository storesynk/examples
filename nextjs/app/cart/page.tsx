import { StoresynkStatic } from "@storesynk/next";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Page } from "@/components/ui/page";
import { Sections } from "@/components/ui/sections";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("cart");
  return {
    title: t("shoppingCart"),
    alternates: buildAlternates({ pathname: "/cart" }),
    robots: { index: false, follow: false },
  };
}

// The Storesynk cart, inline. The same cart-line components as the layout
// drawer, reading the shared shopify_cartId cart through the store context —
// fully client-rendered (carts are per-user), so the page itself stays static.
export default async function CartPage() {
  const t = await getTranslations("cart");

  return (
    <Page>
      <Container>
        <Sections className="gap-5">
          <h1 className="text-2xl font-semibold sm:text-3xl">{t("shoppingCart")}</h1>
          <div className="group grid max-w-2xl gap-2.5">
            <p className="hidden text-sm text-muted-foreground group-[:has(cart-line-list[ss-empty])]:block">
              {t("empty")}{" "}
              <Link href="/collections/all" className="underline">
                {t("continueShopping")}
              </Link>
            </p>
            {/* StoresynkStatic: the engine removes the template line and inserts
                clones, and every cart mutation re-renders the RSC tree — React
                must never reconcile this subtree. The empty-state <p> above stays
                outside (next/link can't be stringified). */}
            <StoresynkStatic>
              <cart-line-list className="block group-[:has(cart-line-list[ss-empty])]:hidden">
                <cart-line className="flex items-center gap-2.5 border-b border-border py-2.5 transition-opacity [&[ss-loading]]:opacity-50">
                  <show-line-image className="block size-14 shrink-0 overflow-hidden rounded-md bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover"></show-line-image>
                  <div className="min-w-0 flex-1">
                    <show-line-title className="block truncate text-sm font-medium"></show-line-title>
                    <show-line-variant className="block text-xs text-muted-foreground [&[ss-empty]]:hidden"></show-line-variant>
                    <show-line-selling-plan className="block text-xs text-muted-foreground [&[ss-empty]]:hidden"></show-line-selling-plan>
                    <span className="font-mono text-sm tabular-nums">
                      <show-line-original-price className="mr-1 text-muted-foreground line-through"></show-line-original-price>
                      <show-line-price></show-line-price>
                    </span>
                    <show-line-discount className="block text-xs text-muted-foreground [&[ss-empty]]:hidden"></show-line-discount>
                    {/* In-cart subscription upsell — mirrors the drawer's block;
                        both controls self-hide via [ss-empty]. */}
                    <change-line-purchase-option className="mt-1.5 flex gap-1.5 [&[ss-empty]]:hidden">
                      <purchase-option
                        value="single"
                        className="cursor-pointer rounded border border-border px-2 py-0.5 text-xs transition-colors hover:border-foreground [&[ss-active]]:border-foreground [&[ss-active]]:ring-1 [&[ss-active]]:ring-foreground"
                      >
                        {t("oneTime")}
                      </purchase-option>
                      <purchase-option
                        value="recurring"
                        className="cursor-pointer rounded border border-border px-2 py-0.5 text-xs transition-colors hover:border-foreground [&[ss-active]]:border-foreground [&[ss-active]]:ring-1 [&[ss-active]]:ring-foreground"
                      >
                        {t("subscribe")}
                      </purchase-option>
                    </change-line-purchase-option>
                    <change-line-selling-plan className="mt-1.5 grid gap-1 [&[ss-empty]]:hidden">
                      <selling-plan-option className="flex cursor-pointer items-center justify-between gap-2 rounded border border-border px-2 py-0.5 text-xs transition-colors hover:border-foreground [&[ss-active]]:border-foreground [&[ss-active]]:ring-1 [&[ss-active]]:ring-foreground">
                        <show-selling-plan-name></show-selling-plan-name>
                        <show-selling-plan-price className="font-mono tabular-nums"></show-selling-plan-price>
                      </selling-plan-option>
                    </change-line-selling-plan>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <decrease-line-quantity className="flex size-6 cursor-pointer items-center justify-center rounded border border-border hover:bg-muted">
                      −
                    </decrease-line-quantity>
                    <show-line-quantity className="w-5 text-center font-mono text-sm tabular-nums"></show-line-quantity>
                    <increase-line-quantity className="flex size-6 cursor-pointer items-center justify-center rounded border border-border hover:bg-muted">
                      +
                    </increase-line-quantity>
                  </div>
                  <remove-cart-line className="cursor-pointer px-1 text-muted-foreground hover:text-foreground">
                    ×
                  </remove-cart-line>
                </cart-line>
              </cart-line-list>
              <div className="flex justify-end group-[:has(cart-line-list[ss-empty])]:hidden">
                <clear-cart className="cursor-pointer text-xs text-muted-foreground underline hover:text-foreground">
                  {t("clearCart")}
                </clear-cart>
              </div>
              <div className="grid gap-2.5 group-[:has(cart-line-list[ss-empty])]:hidden">
                <cart-note className="block">
                  <textarea
                    aria-label={t("noteLabel")}
                    placeholder={t("notePlaceholder")}
                    rows={2}
                    className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                  />
                </cart-note>
                <apply-discount className="flex gap-1.5">
                  <input
                    type="text"
                    aria-label={t("discountCode")}
                    placeholder={t("discountCode")}
                    className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                  />
                  <button
                    type="button"
                    className="h-9 cursor-pointer rounded-md border border-border px-3 text-sm font-medium hover:bg-muted"
                  >
                    {t("applyDiscount")}
                  </button>
                </apply-discount>
                <cart-discount-list className="flex flex-wrap gap-1.5 [&[ss-empty]]:hidden">
                  <cart-discount className="flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-xs">
                    <show-discount-code></show-discount-code>
                    <remove-discount
                      aria-label={t("removeDiscount")}
                      className="cursor-pointer leading-none text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </remove-discount>
                  </cart-discount>
                </cart-discount-list>
                <show-discount-error className="block text-xs text-destructive [&[ss-empty]]:hidden">
                  {t("discountInvalidCode")}
                </show-discount-error>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t("subtotal")}</span>
                  <show-cart-subtotal className="font-mono tabular-nums"></show-cart-subtotal>
                </div>
                <cart-order-discount-list className="grid gap-1 [&[ss-empty]]:hidden">
                  <cart-discount className="flex justify-between text-sm text-muted-foreground">
                    <show-discount-code></show-discount-code>
                    <show-discount-amount className="font-mono tabular-nums"></show-discount-amount>
                  </cart-discount>
                </cart-order-discount-list>
                <div className="flex justify-between text-sm text-muted-foreground [&:has(show-cart-tax[ss-empty])]:hidden">
                  <span>{t("estimatedTax")}</span>
                  <show-cart-tax className="font-mono tabular-nums"></show-cart-tax>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground [&:has(show-cart-duties[ss-empty])]:hidden">
                  <span>{t("duties")}</span>
                  <show-cart-duties className="font-mono tabular-nums"></show-cart-duties>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>{t("estimatedTotal")}</span>
                  <show-cart-total className="font-mono tabular-nums"></show-cart-total>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground [&:has(show-cart-savings[ss-empty])]:hidden">
                  <span>{t("savings")}</span>
                  <show-cart-savings className="font-mono tabular-nums"></show-cart-savings>
                </div>
              </div>
              <checkout-link className="block group-[:has(cart-line-list[ss-empty])]:hidden">
                <a
                  href="#"
                  className="block h-11 w-full cursor-pointer rounded-md bg-foreground px-5 text-center text-sm font-medium leading-11 text-background transition-opacity hover:opacity-90"
                >
                  {t("completeCheckout")}
                </a>
              </checkout-link>
            </StoresynkStatic>
          </div>
        </Sections>
      </Container>
    </Page>
  );
}
