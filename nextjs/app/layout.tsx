import "./globals.css";
import "../storesynk.config";
import { StoresynkStatic, StoresynkStore } from "@storesynk/next";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";

import { ActionBar } from "@/components/action-bar";
import { AgentButton } from "@/components/agent/agent-button";
import { AnalyticsComponents } from "@/components/analytics";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { SiteSchema } from "@/components/schema/site-schema";
import { Toaster } from "@/components/ui/sonner";
import { getLocale } from "@/lib/params";
import { buildAlternates } from "@/lib/seo";
import { shopConfig } from "@/shop.config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [locale, messages, t, tc] = await Promise.all([
    getLocale(),
    getMessages(),
    getTranslations("accessibility"),
    getTranslations("cart"),
  ]);

  return (
    <html lang={locale}>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-dvh flex-col font-sans antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-background focus:px-5 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:ring-2 focus:ring-foreground focus:outline-none"
        >
          {t("skipToContent")}
        </a>
        <SiteSchema locale={locale} />
        {/* Shop payload + config fetches are cached and tagged inside
            @storesynk/next ("shop" tag) — no app-authored cache scope needed. */}
        <StoresynkStore className="contents" serverCart>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Nav locale={locale} />
            <main id="main-content" className="flex flex-1 flex-col min-w-0">
              {children}
            </main>
            <Footer locale={locale} />
            {/* The Storesynk cart drawer: engine-owned structure (template cloning),
                so it goes through StoresynkStatic. Behavior (open-on-add,
                close-on-outside, note debounce) comes from storesynk.config.ts via
                the store's config payload. */}
            <StoresynkStatic>
              <storesynk-cart className="group peer invisible fixed inset-y-0 right-0 z-70 flex h-full w-[calc(100%-2.5rem)] max-w-md translate-x-full flex-col border-l bg-card shadow-lg transition-[translate,visibility] duration-300 ease-in-out [&[ss-open]]:visible [&[ss-open]]:translate-x-0 [&[ss-open]]:duration-500">
                <div className="flex h-16 shrink-0 items-center justify-between px-5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{tc("shoppingCart")}</h2>
                    <show-cart-count
                      hide-when-zero=""
                      className="flex size-5 items-center justify-center rounded-full bg-foreground text-xs text-background [&[ss-empty]]:hidden"
                    ></show-cart-count>
                  </div>
                  <close-cart className="absolute right-2.5 top-3 flex size-10 cursor-pointer items-center justify-center rounded-full text-xl leading-none opacity-70 transition-opacity hover:opacity-100">
                    ×
                  </close-cart>
                </div>
                <p className="hidden px-5 text-sm text-muted-foreground group-[[ss-empty]]:block">
                  {tc("empty")}
                </p>
                <cart-line-list className="block flex-1 overflow-y-auto px-5 group-[[ss-empty]]:hidden">
                  <cart-line className="flex items-center gap-2.5 border-b border-border py-2.5 transition-opacity [&[ss-loading]]:opacity-50">
                    <show-line-image className="block size-12 shrink-0 self-start overflow-hidden rounded-md bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover"></show-line-image>
                    <div className="min-w-0 flex-1">
                      <show-line-title className="block truncate text-sm font-medium"></show-line-title>
                      <show-line-variant className="block text-xs text-muted-foreground [&[ss-empty]]:hidden"></show-line-variant>
                      <show-line-selling-plan className="block text-xs text-muted-foreground [&[ss-empty]]:hidden"></show-line-selling-plan>
                      <span className="font-mono text-sm tabular-nums">
                        <show-line-original-price className="mr-1 text-muted-foreground line-through"></show-line-original-price>
                        <show-line-price></show-line-price>
                      </span>
                      <show-line-discount className="block text-xs text-muted-foreground [&[ss-empty]]:hidden"></show-line-discount>
                      {/* A merged bundle / mix & match line: the engine exposes the Cart Transform
                          components, always expanded here (add a toggle-line-components disclosure
                          to make them collapsible); the list hides via [ss-empty] on plain lines. */}
                      <cart-line-component-list className="mt-2 grid gap-2 [&[ss-empty]]:hidden">
                        <div className="flex items-center gap-2">
                          <show-line-image className="block size-9 shrink-0 overflow-hidden rounded-md border border-border bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover"></show-line-image>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-baseline gap-1 text-xs">
                              <show-line-quantity className="font-mono tabular-nums"></show-line-quantity>
                              <span aria-hidden="true">&times;</span>
                              <show-line-title className="truncate"></show-line-title>
                            </span>
                            <show-line-variant className="block text-xs text-muted-foreground [&[ss-empty]]:hidden"></show-line-variant>
                          </span>
                        </div>
                      </cart-line-component-list>
                      {/* In-cart subscription upsell: both controls self-hide via
                          [ss-empty] when the line's merchandise has no selling plans
                          (toggle) / while the line is one-time (frequency picker). */}
                      <change-line-purchase-option className="mt-1.5 flex gap-1.5 [&[ss-empty]]:hidden">
                        <purchase-option
                          value="single"
                          className="cursor-pointer rounded border border-border px-2 py-0.5 text-xs transition-colors hover:border-foreground [&[ss-active]]:border-foreground [&[ss-active]]:ring-1 [&[ss-active]]:ring-foreground"
                        >
                          {tc("oneTime")}
                        </purchase-option>
                        <purchase-option
                          value="recurring"
                          className="cursor-pointer rounded border border-border px-2 py-0.5 text-xs transition-colors hover:border-foreground [&[ss-active]]:border-foreground [&[ss-active]]:ring-1 [&[ss-active]]:ring-foreground"
                        >
                          {tc("subscribe")}
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
                <div className="grid gap-2.5 border-t border-border p-5 group-[[ss-empty]]:hidden">
                  <cart-note className="block">
                    <textarea
                      aria-label={tc("noteLabel")}
                      placeholder={tc("notePlaceholder")}
                      rows={2}
                      className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                    />
                  </cart-note>
                  <apply-discount className="flex gap-1.5">
                    <input
                      type="text"
                      aria-label={tc("discountCode")}
                      placeholder={tc("discountCode")}
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                    />
                    <button
                      type="button"
                      className="h-9 cursor-pointer rounded-md border border-border px-3 text-sm font-medium hover:bg-muted"
                    >
                      {tc("applyDiscount")}
                    </button>
                  </apply-discount>
                  <cart-discount-list className="flex flex-wrap gap-1.5 [&[ss-empty]]:hidden">
                    <cart-discount className="flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-xs">
                      <show-discount-code></show-discount-code>
                      <remove-discount
                        aria-label={tc("removeDiscount")}
                        className="cursor-pointer leading-none text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </remove-discount>
                    </cart-discount>
                  </cart-discount-list>
                  <show-discount-error className="block text-xs text-destructive [&[ss-empty]]:hidden">
                    {tc("discountInvalidCode")}
                  </show-discount-error>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{tc("subtotal")}</span>
                    <show-cart-subtotal className="font-mono tabular-nums"></show-cart-subtotal>
                  </div>
                  <cart-order-discount-list className="grid gap-1 [&[ss-empty]]:hidden">
                    <cart-discount className="flex justify-between text-sm text-muted-foreground">
                      <show-discount-code></show-discount-code>
                      <show-discount-amount className="font-mono tabular-nums"></show-discount-amount>
                    </cart-discount>
                  </cart-order-discount-list>
                  <div className="flex justify-between text-sm text-muted-foreground [&:has(show-cart-tax[ss-empty])]:hidden">
                    <span>{tc("estimatedTax")}</span>
                    <show-cart-tax className="font-mono tabular-nums"></show-cart-tax>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground [&:has(show-cart-duties[ss-empty])]:hidden">
                    <span>{tc("duties")}</span>
                    <show-cart-duties className="font-mono tabular-nums"></show-cart-duties>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>{tc("estimatedTotal")}</span>
                    <show-cart-total className="font-mono tabular-nums"></show-cart-total>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground [&:has(show-cart-savings[ss-empty])]:hidden">
                    <span>{tc("savings")}</span>
                    <show-cart-savings className="font-mono tabular-nums"></show-cart-savings>
                  </div>
                  <checkout-link className="block">
                    <a
                      href="#"
                      className="block h-11 w-full cursor-pointer rounded-md bg-foreground px-5 text-center text-sm font-medium leading-11 text-background transition-opacity hover:opacity-90"
                    >
                      {tc("completeCheckout")}
                    </a>
                  </checkout-link>
                </div>
              </storesynk-cart>
              <div
                aria-hidden
                className="invisible fixed inset-0 z-60 bg-black/30 opacity-0 backdrop-blur-sm transition-[opacity,visibility] duration-300 peer-[[ss-open]]:visible peer-[[ss-open]]:opacity-100"
              />
            </StoresynkStatic>
            <Suspense>
              <ActionBar>{shopConfig.agent.enabled && <AgentButton />}</ActionBar>
            </Suspense>
            <Toaster closeButton />
          </NextIntlClientProvider>
        </StoresynkStore>
        <AnalyticsComponents />
      </body>
    </html>
  );
}

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("seo");

  return {
    alternates: buildAlternates({ pathname: "/" }),
    description: t("defaultDescription", { name: shopConfig.site.name }),
    generator: shopConfig.site.name,
    metadataBase: new URL(shopConfig.site.url),
    openGraph: {
      images: [{ url: "/og-default.png", width: 1200, height: 630 }],
    },
    title: {
      default: shopConfig.site.name,
      template: `%s | ${shopConfig.site.name}`,
    },
  };
};
