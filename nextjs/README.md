# Storesynk Next.js Starter

The official Storesynk starter for Next.js: [Vercel Shop](https://vercel.shop) (MIT, see
`LICENSE`) with its commerce surfaces powered by `@storesynk/*` web components. React keeps
the chrome — nav, search, collections, account, the AI assistant — while product display and
the cart speak Shopify's **standard storefront actions and events**, so apps, pixels, and
on-page agents integrate exactly as they would with a real theme.

## Setup

### GitHub Codespaces

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/storesynk/examples?devcontainer_path=.devcontainer/nextjs/devcontainer.json)

1. Open the link above and sign in to GitHub. The create page asks for two secrets:
   - `SHOPIFY_STORE_DOMAIN`: your `*.myshopify.com` domain
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN`: the **public** token from the Headless sales
     channel (never an Admin token)
2. Click **Create codespace**. It installs dependencies and starts the dev server in the
   terminal by itself.
3. When port 3000 is forwarded, click **Open in Browser**. The storefront runs at
   `https://<codespace-name>-3000.app.github.dev`.

Secrets are saved to your GitHub account for this repository and reused by later
codespaces. If you add or change one after creation, stop and restart the codespace so it
picks up the new value. The site URL is derived from the codespace name, so no URL setting
is needed. For customer login, also add `NEXT_PUBLIC_ENABLE_AUTH=1`,
`SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID` and `CUSTOMER_ACCOUNT_SESSION_SECRET` as secrets,
and add the storefront URL to the Customer Account API allowed origins and callback URIs
in the Headless channel.

### Local

```sh
cp .env.example .env.local   # fill in SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN
npm ci
npm run dev                  # http://localhost:3000
```

Production build: `npm run build`, serve with `npm run start`. Node 24 (`.nvmrc`).

### Cache freshness

`storesynk.config.ts` sets `cacheLife: "minutes"`, so offers edited in the Storesynk app
show within about a minute: reload once to trigger the refresh, then again to see it.
Shorter profiles break the production build. For a real deployment, register the webhook route
(`createStoresynkWebhookHandler`) with Shopify and switch back to the package default
`"max"`.

## What Storesynk powers here

- **Home grid** — `<StoresynkList allProducts>`: eight server-filled cards with crawlable
  `/products/…` links, responsive Shopify-CDN `srcset`, and per-card payloads the client
  runtime adopts with zero refetch.
- **Product page** — one shared `StoresynkProductDetail` (static host elements: the same
  tags you'd write on a plain HTML page, including every app offer widget, each hidden
  until the product has a live offer) with `sync-url`: option clicks update instantly
  client-side and mirror into the query string. The route awaits `searchParams` top-level
  (`instant = false`), so variant URLs (`?color=Blue`) server-render the **exact** variant
  — including its image and active thumbnail — and shared links never flash the default
  variant; bare URLs render the default variant. Non-option params (`?utm_…`) are ignored
  by the core selection matching.
- **Cart** — Storesynk end to end, server-owned via `<StoresynkStore serverCart>`: the
  cart id lives in an HttpOnly `shopify_cartId` cookie **shared with the AI agent tools**
  — one cart, two writers. The UI is the `<storesynk-cart>` drawer in the layout (styled
  to the template's sheet look) plus an inline cart on `/cart`; every update repaints from
  the server action's response — cart money is never predicted client-side, since
  automatic discounts (tiers, thresholds) can reprice any line on any mutation. The nav
  count is SSR'd from the same cookie, and the agent reconciler refreshes the drawer
  through the standard actions (`window.Shopify.actions`) after tool calls.
- **SEO & agents** — multi-variant products emit `ProductGroup`/`hasVariant` JSON-LD with
  per-variant URLs (each of which server-renders that variant): agents discover the
  complete variant map in one machine-readable block. The base's `/md/*` mirrors and
  `llms.txt` still work.
- **Buy with Shop** — `<buy-now payment="shop-pay">` (a cart-permalink hint, no server
  code), gated by `shopConfig.pdp.buyWithShop`.
- **PDP commerce widgets** — `<storesynk-volume-discount>` (quantity-break tier table with
  advisory prices; the app's Discount Function applies the real percentage at checkout),
  `<storesynk-bundle>` (multi-product offers whose add becomes ONE merged bundle cart line
  via the app's Cart Transform; member cards offer only the merchant-allowed variants when
  a member is variant-restricted), a selling-plan/purchase-option picker (self-hides on
  plan-less products — the demo store has none, so only its hidden state is exercised
  here), `<show-sale-badge format="percentage">`, and `custom.care`/`custom.material`
  metafield rows (self-hiding; author the key as `field=` — React swallows `key`).
- **Predictive search** — the nav search modal keeps the template's dialog shell but the
  content is Storesynk's `<predictive-search>` (engine-cloned result cards through
  `StoresynkStatic`; Enter submits a plain GET to the server-rendered `/search` page).
  NOTE: the dialog portals INTO `<storesynk-store>` — a body-level portal would strand
  the element outside the store context and it would silently render nothing.

Unconverted by design: the /search results page (server-rendered with URL params —
`search-result-list` is client-only and converting it would regress SSR and the `/md`
mirrors), collections (their filter/facet PLP is excellent),
account/auth, blogs/policies, and the AI assistant — all pristine Vercel Shop. One
webhook route (`createStoresynkWebhookHandler` from `@storesynk/next`) invalidates both
lanes: the package's cached operations and the template's own operations share the same
tag taxonomy (`products`, `product-<handle>`, `product-<numericId>`, `cart`).

## Cache Components patterns

Storesynk caching is package-owned: `@storesynk/next`'s data helpers run in their own
`"use cache"` scopes with data-derived tags (`products`, `product-<handle>`,
`product-<numericId>`, `collections`, `collection-<handle>`, `products-index`, `shop`),
so this app writes **no** cache scopes around Storesynk regions — the webhook route
invalidates them directly, and product updates reach every grid the product appears in
(list operations tag each listed product's numeric id). Wrapping a region in your own
`"use cache"` scope for fragment-output caching stays safe: the package's tags propagate
to the enclosing scope.

## Known dev-only console noise (harmless, production verified clean)

1. **Hydration mismatch on `<storesynk-product>`** — Next's dev-mode Cache Components
   restore cached trees with the `dangerouslySetInnerHTML` prop in serialized shape and
   dev flags it on the second request of a cached route. Content is identical; React keeps
   the server HTML. Suppressed via `suppressHydrationWarning` on the Storesynk hosts
   (they are deliberately React-opaque). Unfixed upstream as of `next@16.3.0-canary.88`.
2. **`React instrumentation encountered an error: "The children should not have changed
if we pass in the same set."`** with an `installHook.js` / `chrome-extension://` call
   stack — thrown **inside the React DevTools browser extension** (its fiber-mirroring
   assertion trips on the same dev-cache-restored Server Component frames). Only appears
   when the extension is installed; disable it and the error vanishes. Not suppressible
   from application code; nothing is wrong with the page.

---

The remaining Vercel Shop documentation still applies to the unconverted surfaces:
customer authentication (Hydrogen + Customer Account API, opt-in via env), next-intl,
the AI assistant (AI SDK), and the `vercel-shop` agent plugin skills
(`/vercel-shop:enable-shopify-markets`, `enable-shopify-menus`, …) — see
[vercel.shop](https://vercel.shop) and `AGENTS.md`.

## License

MIT — derived from Vercel Shop.
