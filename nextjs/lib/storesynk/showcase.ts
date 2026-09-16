import "server-only";
import {
  gql,
  isAddonsActive,
  isBundleActive,
  isMixMatchActive,
  isVolumeDiscountLive,
  parseAddonsMetaobject,
  parseBundleMetaobject,
  parseMixMatchMetaobject,
  parseVolumeDiscountMetaobject,
  resolveAddonRows,
  resolveBundleMembers,
  resolveMixMatchSections,
} from "@storesynk/core";
import { getClient, getConfig } from "@storesynk/next/runtime";
import { cacheLife, cacheTag } from "next/cache";

export type ShowcaseKind = "bundle" | "mix-match" | "product-addons" | "volume-discount";

// Optional per-page override; unset, the page discovers a product from the offers
// the Storesynk app publishes.
const ENV_OVERRIDE: Record<ShowcaseKind, string | undefined> = {
  bundle: process.env.NEXT_PUBLIC_BUNDLE_TEST_HANDLE,
  "mix-match": process.env.NEXT_PUBLIC_MM_TEST_HANDLE,
  "product-addons": process.env.NEXT_PUBLIC_PA_TEST_HANDLE,
  "volume-discount": process.env.NEXT_PUBLIC_VD_TEST_HANDLE,
};

// Storefront metaobject types are `<appNamespace>--<type>`; core exports no suffix for bundles.
const BUNDLE_TYPE_SUFFIX = "bundle";

// The member fragment must match core's BundleMemberProduct field for field: the
// parsers and resolve* helpers below consume these nodes as the widgets would.
const MEMBER_PRODUCT = gql(`
  fragment ShowcaseMemberProduct on Product {
    id handle title
    featuredImage { url altText }
    priceRange { minVariantPrice { amount currencyCode } }
    options { name optionValues { name } }
    variants(first: 100) {
      pageInfo { hasNextPage }
      nodes {
        id title availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        image { url altText }
        selectedOptions { name value }
      }
    }
  }
`);

// Core's VolumeDiscountMetaobject plus the `products` targets and one visible product per collection.
const VOLUME_DISCOUNT = gql(`
  fragment ShowcaseVolumeDiscount on Metaobject {
    id handle
    title: field(key: "title") { value }
    status: field(key: "status") { value }
    tiers: field(key: "tiers") { value }
    appliesTo: field(key: "applies_to") { value }
    startsAt: field(key: "starts_at") { value }
    endsAt: field(key: "ends_at") { value }
    collections: field(key: "collections") {
      references(first: 25) {
        nodes { __typename ... on Collection { id products(first: 1) { nodes { handle } } } }
      }
    }
    products: field(key: "products") {
      references(first: 10) { nodes { __typename ... on Product { handle } } }
    }
  }
`);

const VOLUME_DISCOUNTS_QUERY = gql(
  `query ShowcaseVolumeDiscounts($namespace: String!) {
    products(first: 1) { nodes { handle } }
    shop {
      volumeDiscounts: metafield(namespace: $namespace, key: "volume_discounts") {
        references(first: 25) { nodes { __typename ...ShowcaseVolumeDiscount } }
      }
    }
  }`,
  [VOLUME_DISCOUNT],
);

// Core's AddonsMetaobject plus the same targeting extras as the volume fragment.
const ADDONS = gql(`
  fragment ShowcaseAddons on Metaobject {
    id handle
    entryId: field(key: "entry_id") { value }
    title: field(key: "title") { value }
    subtitle: field(key: "subtitle") { value }
    status: field(key: "status") { value }
    appliesTo: field(key: "applies_to") { value }
    addons: field(key: "addons") { value }
    discount: field(key: "discount") { value }
    startsAt: field(key: "starts_at") { value }
    endsAt: field(key: "ends_at") { value }
    collections: field(key: "collections") {
      references(first: 50) {
        nodes { __typename ... on Collection { id products(first: 1) { nodes { handle } } } }
      }
    }
    addonProducts: field(key: "addon_products") {
      references(first: 60) {
        pageInfo { hasNextPage }
        nodes { __typename ...ShowcaseMemberProduct }
      }
    }
    products: field(key: "products") {
      references(first: 10) { nodes { __typename ... on Product { handle } } }
    }
  }
`);

const ADDONS_QUERY = gql(
  `query ShowcaseProductAddons($namespace: String!) {
    products(first: 1) { nodes { handle } }
    shop {
      addons: metafield(namespace: $namespace, key: "product_addons") {
        references(first: 25) { nodes { __typename ...ShowcaseAddons } }
      }
    }
  }`,
  [ADDONS, MEMBER_PRODUCT],
);

// Core's MixMatchMetaobject, verbatim.
const MIX_MATCH = gql(`
  fragment ShowcaseMixMatch on Metaobject {
    id handle
    entryId: field(key: "entry_id") { value }
    title: field(key: "title") { value }
    status: field(key: "status") { value }
    presentation: field(key: "presentation") { value }
    sections: field(key: "sections") { value }
    discount: field(key: "discount") { value }
    startsAt: field(key: "starts_at") { value }
    endsAt: field(key: "ends_at") { value }
    parent: field(key: "parent_product") {
      reference { __typename ... on Product { id handle } }
    }
    sectionProducts: field(key: "section_products") {
      references(first: 60) {
        pageInfo { hasNextPage }
        nodes { __typename ...ShowcaseMemberProduct }
      }
    }
  }
`);

const MIX_MATCH_QUERY = gql(
  `query ShowcaseMixMatch($namespace: String!) {
    shop {
      mixMatch: metafield(namespace: $namespace, key: "mix_match") {
        references(first: 25) { nodes { __typename ...ShowcaseMixMatch } }
      }
    }
  }`,
  [MIX_MATCH, MEMBER_PRODUCT],
);

// Core's BundleMetaobject, verbatim. Bundles have no shop-level list, so the type is queried directly.
const BUNDLE = gql(`
  fragment ShowcaseBundle on Metaobject {
    id handle
    title: field(key: "title") { value }
    pricing: field(key: "pricing") { value }
    members: field(key: "members") { value }
    startsAt: field(key: "starts_at") { value }
    endsAt: field(key: "ends_at") { value }
    parent: field(key: "parent_product") {
      reference { __typename ... on Product { id handle } }
    }
    memberProducts: field(key: "member_products") {
      references(first: 20) { nodes { __typename ...ShowcaseMemberProduct } }
    }
  }
`);

const BUNDLES_QUERY = gql(
  `query ShowcaseBundles($type: String!) {
    metaobjects(type: $type, first: 25) { nodes { __typename ...ShowcaseBundle } }
  }`,
  [BUNDLE, MEMBER_PRODUCT],
);

type Typed = { __typename: string };
type References<T> = { references?: { nodes: readonly T[] } | null } | null | undefined;
type ProductRef = { __typename: "Product"; handle: string };
type CollectionRef = {
  __typename: "Collection";
  products: { nodes: readonly { handle: string }[] };
};

function metaobjectNodes<T extends Typed>(refs: References<T>) {
  return (refs?.references?.nodes ?? []).filter(
    (node): node is Extract<T, { __typename: "Metaobject" }> => node.__typename === "Metaobject",
  );
}

// Unpublished products drop out of reference lists, so the first node is the first visible one.
function firstProductHandle(refs: References<Typed>): string | null {
  const product = refs?.references?.nodes.find(
    (node): node is ProductRef => node.__typename === "Product",
  );
  return product?.handle ?? null;
}

function firstCollectionProductHandle(refs: References<Typed>): string | null {
  for (const node of refs?.references?.nodes ?? []) {
    if (node.__typename !== "Collection") continue;
    const handle = (node as CollectionRef).products.nodes[0]?.handle;
    if (handle) return handle;
  }
  return null;
}

function targetedHandle(
  appliesTo: "all" | "products" | "collections",
  node: { products: References<Typed>; collections: References<Typed> },
  catalogHandle: string | null,
): string | null {
  switch (appliesTo) {
    case "products":
      return firstProductHandle(node.products);
    case "collections":
      return firstCollectionProductHandle(node.collections);
    case "all":
      return catalogHandle;
  }
}

async function discoverVolumeDiscount(namespace: string): Promise<string | null> {
  const { data, errors } = await getClient().graphql(VOLUME_DISCOUNTS_QUERY, {
    variables: { namespace },
  });
  if (errors || !data) return warn("volume-discount", errors);
  const catalogHandle = data.products.nodes[0]?.handle ?? null;
  for (const node of metaobjectNodes(data.shop.volumeDiscounts)) {
    const entry = parseVolumeDiscountMetaobject(node);
    if (!entry || !isVolumeDiscountLive(entry)) continue;
    const handle = targetedHandle(entry.appliesTo, node, catalogHandle);
    if (handle) return handle;
  }
  return null;
}

async function discoverAddons(namespace: string): Promise<string | null> {
  const { data, errors } = await getClient().graphql(ADDONS_QUERY, { variables: { namespace } });
  if (errors || !data) return warn("product-addons", errors);
  const catalogHandle = data.products.nodes[0]?.handle ?? null;
  for (const node of metaobjectNodes(data.shop.addons)) {
    const parsed = parseAddonsMetaobject(node);
    if (!parsed || !isAddonsActive(parsed.entry)) continue;
    if (!resolveAddonRows(parsed.entry, parsed.products)) continue;
    const handle = targetedHandle(parsed.entry.appliesTo, node, catalogHandle);
    if (handle) return handle;
  }
  return null;
}

async function discoverMixMatch(namespace: string): Promise<string | null> {
  const { data, errors } = await getClient().graphql(MIX_MATCH_QUERY, { variables: { namespace } });
  if (errors || !data) return warn("mix-match", errors);
  for (const node of metaobjectNodes(data.shop.mixMatch)) {
    const parsed = parseMixMatchMetaobject(node);
    if (!parsed || !isMixMatchActive(parsed.entry)) continue;
    const sections = resolveMixMatchSections(parsed.entry, parsed.products);
    if (!sections) continue;
    const parent = node.parent?.reference;
    const handle =
      (parent?.__typename === "Product" ? parent.handle : null) ??
      sections[0]?.products[0]?.handle ??
      null;
    if (handle) return handle;
  }
  return null;
}

async function discoverBundle(namespace: string): Promise<string | null> {
  const { data, errors } = await getClient().graphql(BUNDLES_QUERY, {
    variables: { type: `${namespace}--${BUNDLE_TYPE_SUFFIX}` },
  });
  if (errors || !data) return warn("bundle", errors);
  for (const node of data.metaobjects.nodes) {
    const parsed = parseBundleMetaobject(node);
    if (!parsed || !isBundleActive(parsed.entry)) continue;
    const members = resolveBundleMembers(parsed.entry, parsed.products);
    if (!members) continue;
    // The bundle's own product (carries its image + price); first member as fallback.
    const parent = node.parent?.reference;
    const handle =
      (parent?.__typename === "Product" ? parent.handle : null) ??
      members[0]?.product.handle ??
      null;
    if (handle) return handle;
  }
  return null;
}

function warn(kind: ShowcaseKind, errors: readonly { message: string }[] | undefined): null {
  console.warn(
    `[pdp-examples] ${kind} discovery failed: ${errors?.map((error) => error.message).join("; ") ?? "no data"}`,
  );
  return null;
}

// 'minutes', not the template's 'max': without webhooks a new offer would otherwise never be found.
async function discoverShowcaseHandle(kind: ShowcaseKind): Promise<string | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("metaobjects", "products", "shop");
  const namespace = getConfig().appNamespace;
  switch (kind) {
    case "bundle":
      return discoverBundle(namespace);
    case "mix-match":
      return discoverMixMatch(namespace);
    case "product-addons":
      return discoverAddons(namespace);
    case "volume-discount":
      return discoverVolumeDiscount(namespace);
  }
}

// Env override, then discovery from the app's published offers, then null (the page's empty state).
export async function findShowcaseHandle(kind: ShowcaseKind): Promise<string | null> {
  return ENV_OVERRIDE[kind] || (await discoverShowcaseHandle(kind));
}
