import type { Metadata } from "next";
import { connection } from "next/server";

import { StoresynkMixMatchDetail } from "@/components/product/storesynk-detail-mix-match";
import { TemplateProductPage, templateProductMetadata } from "@/components/product/template-page";
import { findShowcaseHandle } from "@/lib/storesynk/showcase";

// The showcase product comes from the offers the Storesynk app publishes (env override first).
const KIND = "mix-match";

// connection() keeps the offer widgets' schedule checks out of the prerender (they read the clock).
export async function generateMetadata(): Promise<Metadata> {
  await connection();
  return templateProductMetadata(KIND, await findShowcaseHandle(KIND));
}

// Request-time rendering — same sanctioned opt-in as /products/[handle].
export const instant = false;

export default async function MixMatchTemplatePage() {
  await connection();
  const handle = await findShowcaseHandle(KIND);
  return <TemplateProductPage detail={StoresynkMixMatchDetail} handle={handle} kind={KIND} />;
}
