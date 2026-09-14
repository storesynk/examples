import type { MenuItem } from "@/lib/shopify/types/menu";

export type SocialPlatform =
  | "facebook"
  | "github"
  | "instagram"
  | "linkedin"
  | "pinterest"
  | "tiktok"
  | "x"
  | "youtube";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface ShopConfig {
  agent: {
    enabled: boolean;
  };
  analytics: {
    speedInsights: {
      enabled: boolean;
    };
    vercel: {
      enabled: boolean;
    };
  };
  auth: {
    enabled: boolean;
  };
  navigation: {
    footer: MenuItem[];
    nav: MenuItem[];
  };
  pdp: {
    bundles: {
      enabled: boolean;
    };
    buyWithShop: {
      enabled: boolean;
    };
    complementaryProducts: {
      enabled: boolean;
    };
    quantityPicker: {
      enabled: boolean;
    };
    relatedProducts: {
      enabled: boolean;
    };
  };
  site: {
    name: string;
    socialLinks: SocialLink[];
    url: string;
  };
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function envFlag(value: string | undefined, fallback: boolean): boolean {
  return value === undefined ? fallback : value === "1";
}

// Site origin, used for metadata, sitemaps and the Customer Account login
// allow-list. NEXT_PUBLIC_BASE_URL wins; inside a GitHub Codespace the forwarded
// port origin is derived from CODESPACE_NAME, so no URL setting is needed.
const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? process.env.NEXT_PUBLIC_BASE_URL
  : process.env.CODESPACE_NAME
    ? `https://${process.env.CODESPACE_NAME}-3000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN ?? "app.github.dev"}`
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000";

export const shopConfig = {
  agent: {
    enabled: envFlag(process.env.NEXT_PUBLIC_ENABLE_AGENT, false),
  },
  analytics: {
    speedInsights: {
      enabled: false,
    },
    vercel: {
      enabled: false,
    },
  },
  auth: {
    enabled: envFlag(process.env.NEXT_PUBLIC_ENABLE_AUTH, false),
  },
  navigation: {
    footer: [],
    nav: [
      {
        id: "default-nav-shop",
        title: "Shop",
        url: "/collections/all",
        type: "HTTP",
        items: [],
      },
      {
        id: "default-nav-pdp-examples",
        title: "PDP Examples",
        url: "/pdp-examples/volume-discount",
        type: "HTTP",
        // /pdp-examples/subscription still exists but is not a Storesynk app feature, so it stays off the menu.
        items: [
          {
            id: "default-nav-pdp-examples-bundle",
            title: "Bundle",
            url: "/pdp-examples/bundle",
            type: "HTTP",
            items: [],
          },
          {
            id: "default-nav-pdp-examples-volume",
            title: "Volume discount",
            url: "/pdp-examples/volume-discount",
            type: "HTTP",
            items: [],
          },
          {
            id: "default-nav-pdp-examples-mix-match",
            title: "Mix & match",
            url: "/pdp-examples/mix-match",
            type: "HTTP",
            items: [],
          },
          {
            id: "default-nav-pdp-examples-product-addons",
            title: "Product add-ons",
            url: "/pdp-examples/product-addons",
            type: "HTTP",
            items: [],
          },
        ],
      },
    ],
  },
  pdp: {
    bundles: {
      enabled: true,
    },
    buyWithShop: {
      enabled: true,
    },
    complementaryProducts: {
      enabled: true,
    },
    quantityPicker: {
      enabled: true,
    },
    relatedProducts: {
      enabled: true,
    },
  },
  site: {
    name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Vercel Shop",
    socialLinks: [],
    url: trimTrailingSlash(process.env.NEXT_PUBLIC_BASE_URL || defaultUrl),
  },
} satisfies ShopConfig;
