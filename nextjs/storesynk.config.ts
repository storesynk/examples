/**
 * Storesynk config — the one place to configure store behavior in this app,
 * scaffolded by `npx @storesynk/next init`. Import it for its side effect at the
 * TOP of app/layout.tsx so the call runs at module scope before any Storesynk
 * component renders:
 *
 *   import '../storesynk.config'; // (or '../../storesynk.config' from src/app/)
 *
 * Every value below is a site-global default — a tag attribute in your JSX still
 * overrides it for that one instance. Uncommented = active; the rest are
 * commented with their allowed values and defaults. Credentials stay in env
 * (SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_ACCESS_TOKEN) and are inherited
 * automatically; the app metafield namespace is fixed in the package for now.
 */
import { configureStoresynk } from "@storesynk/next";

configureStoresynk({
  // ── Cache freshness ─────────────────────────────────────────────────────
  // The package default is 'max': cached reads live until a Shopify webhook
  // revalidates them. This example runs without webhooks, so offers edited in
  // the Storesynk app would never appear. 'minutes' refreshes them within about
  // a minute. Don't go shorter: Next treats caches that expire in under five
  // minutes as dynamic data, which fails the prerender of the layout.
  // Switch back to 'max' once the webhook route is registered with Shopify.
  cacheLife: "minutes",
  // ── Connection ──────────────────────────────────────────────────────────
  // Inherited from env by default. Pass here only to override env.
  // domain: 'your-shop.myshopify.com',
  // token: 'your-public-storefront-token', // public token only — never Admin
  // ── Locale (Shopify @inContext) ─────────────────────────────────────────
  // country: 'US',            // ISO country for pricing/markets. Default: none.
  // language: 'EN',           // ISO language for cart i18n. Default: none.
  // persistLocale: 'cookie',  // 'cookie' (default; server-readable) | 'localStorage' | 'none'.
  //                           // The cookie lets SSR routes render the buyer's market.
  // ── Customer accounts (Customer Account API) ────────────────────────────
  // Setting customerClientId turns on the customers module (login,
  // show-customer-* displayers, cart buyer identity for customer pricing).
  // customerClientId: 'shp_xxxxxxxx',
  // customerRedirectUri: 'https://you.com/account/callback', // must be allow-listed.
  // customerAccountPages: 'shopify',   // 'shopify' (hosted portal, default) | 'custom'.
  // customerAccountUrl: '/account',    // REQUIRED when customerAccountPages is 'custom'.
  // ── Cart behavior ───────────────────────────────────────────────────────
  // These configure the <storesynk-cart> drawer in app/layout.tsx (and any
  // other Storesynk cart surface) — the engine reads them from the config
  // payload <StoresynkStore> emits.
  cart: {
    openOnAdd: true, //       open the cart after add-to-cart. Default: true.
    closeOnOutside: true, //  clicking the backdrop closes the cart. Default: false.
    noteDebounce: 500, //     ms before the order note saves. Default: 500.
  },
  // ── Pixels / analytics ──────────────────────────────────────────────────
  // Enabling loads the (lazy) pixels module and forwards Shopify's canonical
  // events to whatever pixels the store already has installed — no IDs to set.
  // pixels: {
  //   enabled: true,               // master switch for client-side pixels. Default: off.
  //   client: ['meta', 'ga'],      // allow-list of client pixels. Omit = all auto-detected.
  //   server: ['meta', 'ga'],      // also forward server-side via the relay (present = relay on).
  //   relayEndpoint: 'https://you.com/collect', // self-hosted relay override.
  //   requireConsent: true,        // legacy, no-op: consent is always enforced via Shopify's Customer Privacy API.
  // },
});
