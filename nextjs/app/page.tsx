import { StoresynkList } from "@storesynk/next";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Page } from "@/components/ui/page";
import { Sections } from "@/components/ui/sections";
import { getLocale } from "@/lib/params";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { shopConfig } from "@/shop.config";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo");
  const title = t("homeTitle");
  const description = t("homeDescription");

  return {
    title: `${title} | ${shopConfig.site.name}`,
    description,
    alternates: buildAlternates({ pathname: "/" }),
    openGraph: buildOpenGraph({
      title,
      description,
      url: "/",
      type: "website",
    }),
  };
}

// Server-rendered Storesynk grid: children are static host elements — the engine fills one
// card clone per product and the client adopts them with zero refetch. The list's fetch is
// cached and tagged inside @storesynk/next (products, products-index, product-<id> per
// product), so the Shopify webhook invalidates it without an app-authored cache scope.
const StoresynkGrid = () => {
  return (
    <StoresynkList allProducts limit={8} className="grid grid-cols-2 gap-5 lg:grid-cols-4">
      <storesynk-product>
        <product-link>
          <a className="group grid gap-2.5">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <show-image
                main=""
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="block h-full w-full"
              >
                <img alt="" className="h-full w-full object-cover" />
              </show-image>
            </div>
            <div className="grid gap-1">
              <span className="line-clamp-1 text-sm">
                <show-title></show-title>
              </span>
              <span className="font-mono text-sm tabular-nums">
                <show-price></show-price>{" "}
                <show-compare-price className="text-muted-foreground line-through"></show-compare-price>
              </span>
            </div>
          </a>
        </product-link>
      </storesynk-product>
    </StoresynkList>
  );
};

export default async function HomePage() {
  const [locale, t, tp] = await Promise.all([
    getLocale(),
    getTranslations("home"),
    getTranslations("product"),
  ]);
  void locale;

  return (
    <Page className="pt-0">
      <Sections>
        <section className="grid">
          <div className="col-start-1 row-start-1 hidden md:block md:aspect-[4/1]" />
          <div className="relative col-start-1 row-start-1 flex items-center justify-center px-5 py-10 lg:px-10">
            <div className="flex flex-col items-center text-center gap-2.5">
              <h1 className="text-3xl md:text-5xl max-w-3xl text-foreground">{t("headline")}</h1>
              <p className="text-sm md:text-base max-w-xl text-foreground">{t("subheadline")}</p>
            </div>
          </div>
        </section>

        <Container>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl">{t("productsTitle")}</h2>
              <Link
                href="/collections/all"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {tp("viewAll")}
              </Link>
            </div>
            <StoresynkGrid />
          </div>
        </Container>
      </Sections>
    </Page>
  );
}
