import { createStoresynkWebhookHandler } from "@storesynk/next";

// HMAC-verified Shopify webhook → cache-tag invalidation (products/*,
// collections/*, metaobjects/*, shop/update). The tag taxonomy matches both
// lanes: @storesynk/next's cached operations emit these tags internally, and
// lib/shopify/operations/* uses the same names.
export const POST = createStoresynkWebhookHandler();
