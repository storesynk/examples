import { StoresynkLocalePicker, StoresynkStatic } from "@storesynk/next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Suspense } from "react";

import { Container } from "@/components/ui/container";
import { isAuthEnabled } from "@/lib/auth";
import { shopConfig } from "@/shop.config";

import { NavAccount, NavAccountFallback } from "./account";
import { CartIcon, CartIconFallback } from "./cart";
import { MobileMenu } from "./mobile-menu";
import { QuickLinks } from "./quick-links";
import { SearchModal } from "./search-modal";

// The predictive search content: engine-owned (template cloning), so it goes
// through StoresynkStatic and into the modal shell as opaque children. The
// form is a plain GET — Enter lands on the server-rendered /search page.
const PredictiveSearchContent = async () => {
  const t = await getTranslations("nav");
  return (
    <StoresynkStatic>
      <predictive-search className="group block" limit={6}>
        <form action="/search" className="flex items-center gap-3 px-4 py-3">
          <svg
            className="size-4 shrink-0 text-foreground/40"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            name="q"
            aria-label={t("search")}
            placeholder={t("searchPlaceholder")}
            maxLength={100}
            autoComplete="off"
            className="flex-1 min-w-0 bg-transparent text-base text-foreground placeholder:text-foreground/40 focus:outline-none"
          />
        </form>
        <div className="hidden max-h-[60vh] overflow-y-auto overscroll-contain border-t border-border/30 py-1.5 group-[[ss-open]]:block">
          <search-result-item className="block">
            <storesynk-product className="block">
              <product-link className="block">
                <a className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent/50">
                  <show-image className="block size-10 shrink-0 overflow-hidden rounded-md bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
                    <img alt="" />
                  </show-image>
                  <span className="min-w-0 flex-1">
                    <show-title className="block truncate text-sm text-foreground"></show-title>
                    <span className="font-mono text-xs tabular-nums text-foreground/60">
                      <show-price></show-price>
                    </span>
                  </span>
                </a>
              </product-link>
            </storesynk-product>
          </search-result-item>
        </div>
      </predictive-search>
    </StoresynkStatic>
  );
};

// Markets country picker: server-rendered by <StoresynkLocalePicker> (options,
// currency labels, selection, localization payload) and adopted by the engine —
// no fetch, no late population. Pre-hidden as a no-JS/single-market guard; the
// server unhides it when the shop has >1 country.
// The localization fetch is cached and tagged inside @storesynk/next
// ("shop"/"localization"), so no app cache scope is needed here.
const CountryPicker = async () => {
  const t = await getTranslations("nav");
  return (
    <StoresynkLocalePicker>
      <change-country show-currency="" hidden className="block">
        <select
          aria-label={t("country")}
          className="h-9 cursor-pointer rounded-md bg-transparent px-1 text-sm transition-colors hover:bg-muted"
        />
      </change-country>
    </StoresynkLocalePicker>
  );
};

export async function Nav({ locale }: { locale: string }) {
  const items = shopConfig.navigation.nav;

  return (
    <nav
      className="sticky top-0 z-30 w-full bg-background pt-[env(safe-area-inset-top,0px)] transition-shadow duration-250"
      id="nav-outer"
    >
      <Container className="flex h-16 items-center gap-2.5 md:gap-5">
        <MobileMenu items={items} />

        <Link className="flex items-center shrink-0" href="/">
          <span className="text-xl leading-4">{shopConfig.site.name}</span>
        </Link>

        <QuickLinks items={items} />

        <div className="flex items-center gap-5 ml-auto">
          {/* display:contents so the hidden picker never claims a flex-gap slot. */}
          <span className="hidden md:contents">
            <CountryPicker />
          </span>
          <SearchModal>
            <PredictiveSearchContent />
          </SearchModal>
          {isAuthEnabled && (
            <Suspense fallback={<NavAccountFallback />}>
              <NavAccount />
            </Suspense>
          )}
          <Suspense fallback={<CartIconFallback />}>
            <CartIcon />
          </Suspense>
        </div>
      </Container>
    </nav>
  );
}
