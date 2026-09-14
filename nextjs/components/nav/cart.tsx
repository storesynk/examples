import { StoresynkStatic } from "@storesynk/next";
import { HandbagIcon } from "lucide-react";

import { getCartIdFromCookie } from "@/lib/cart/server";
import { withFallback } from "@/lib/shopify/errors";
import { getCachedCartById } from "@/lib/shopify/operations/cart";

export function CartIconFallback() {
  return (
    <span className="flex size-9 items-center justify-center">
      <HandbagIcon className="size-5" />
    </span>
  );
}

// Inlined lucide "handbag" SVG: lucide-react icons are client components, and
// children of StoresynkStatic are stringified server-side — host elements only.
const HandbagSvg = () => (
  <svg
    className="size-5"
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
    <path d="M2.048 18.566A2 2 0 0 0 4 21h16a2 2 0 0 0 1.952-2.434l-2-9A2 2 0 0 0 18 8H6a2 2 0 0 0-1.952 1.566z" />
    <path d="M8 11V6a4 4 0 0 1 8 0v5" />
  </svg>
);

// <open-cart> opens the Storesynk drawer; the count badge is SSR-seeded from
// the shared shopify_cartId cookie (the engine repaints the same number live).
// StoresynkStatic keeps this engine-mutated subtree opaque to React — it
// streams in as a dynamic segment and would otherwise hydrate against DOM the
// engine already rewrote (count text, hidden, Clickable role/tabindex).
export async function CartIcon() {
  // Cookie read is the only dynamic work; the cart itself comes from the
  // "cart"-tagged cache, so the badge streams with the shell instead of
  // waiting a Shopify roundtrip on every load.
  const cartId = await getCartIdFromCookie();
  const cart = cartId ? await withFallback(getCachedCartById(cartId), undefined) : undefined;
  const count = cart?.totalQuantity ?? 0;

  return (
    <StoresynkStatic>
      <open-cart className="relative flex size-9 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-muted">
        <HandbagSvg />
        <show-cart-count
          hide-when-zero=""
          className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-foreground font-mono text-[10px] tabular-nums text-background"
          {...(count === 0 ? { hidden: true } : {})}
        >
          {count > 0 ? count : ""}
        </show-cart-count>
      </open-cart>
    </StoresynkStatic>
  );
}
