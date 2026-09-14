import { getRequestLocale, type I18nState } from "@storesynk/next";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";

import { detailLabels, type DetailLabels } from "@/components/product/storesynk-parts";
import { Container } from "@/components/ui/container";
import { Page } from "@/components/ui/page";
import { Sections } from "@/components/ui/sections";
import { getLocale } from "@/lib/params";
import { buildProductMetadata } from "@/lib/seo";
import { getProduct } from "@/lib/shopify/operations/products";
import type { ShowcaseKind } from "@/lib/storesynk/showcase";

export type TemplateKind = ShowcaseKind | "subscription";

interface TemplateDetailProps {
  buyerLocale?: I18nState | null;
  handle: string;
  labels: DetailLabels;
}

const MESSAGE_KEYS = {
  bundle: "bundle",
  "mix-match": "mixMatch",
  "product-addons": "productAddons",
  subscription: "subscription",
  "volume-discount": "volumeDiscount",
} as const;

// A null handle (no offer found) falls back to the example's name.
export async function templateProductMetadata(
  kind: TemplateKind,
  handle: string | null,
): Promise<Metadata> {
  if (handle) return buildProductMetadata(handle, await getLocale(), `/products/${handle}`);
  const t = await getTranslations("pdpExamples");
  return { title: t(`${MESSAGE_KEYS[kind]}.title`) };
}

// Shared shell for the /pdp-examples/* PDP demo routes: resolves locale + labels,
// renders the empty state when no showcase product was found, 404s unknown handles,
// and renders the given detail template in the standard page chrome. Canonicals
// point at /products/[handle] (see each route).
export const TemplateProductPage = async ({
  detail: Detail,
  handle,
  kind,
}: {
  detail: ComponentType<TemplateDetailProps>;
  handle: string | null;
  /** Names the empty state; a null handle without it is a plain 404. */
  kind?: TemplateKind;
}) => {
  if (!handle) {
    if (!kind) notFound();
    const t = await getTranslations("pdpExamples");
    const key = MESSAGE_KEYS[kind];
    return (
      <Page>
        <Container className="bg-background">
          <Sections>
            <div className="grid gap-2.5 py-10 text-center">
              <h1 className="text-2xl">{t(`${key}.title`)}</h1>
              <p className="text-muted-foreground">{t(`${key}.empty`)}</p>
            </div>
          </Sections>
        </Container>
      </Page>
    );
  }

  const [locale, t, buyerLocale] = await Promise.all([
    getLocale(),
    getTranslations("product"),
    getRequestLocale(),
  ]);

  const product = await getProduct({ handle, locale });
  if (!product) notFound();

  return (
    <Page className="pt-0">
      <Container className="bg-background">
        <Sections>
          <Detail buyerLocale={buyerLocale} handle={handle} labels={detailLabels(t)} />
        </Sections>
      </Container>
    </Page>
  );
};
