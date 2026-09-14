import type { Metadata } from "next";
import { connection } from "next/server";

import { StoresynkBundleDetail } from "@/components/product/storesynk-detail-bundle";
import { TemplateProductPage, templateProductMetadata } from "@/components/product/template-page";
import { findShowcaseHandle } from "@/lib/storesynk/showcase";

// The showcase product comes from the offers the Storesynk app publishes (env override first).
const KIND = "bundle";

// connection() keeps the offer widgets' schedule checks out of the prerender (they read the clock).
export async function generateMetadata(): Promise<Metadata> {
  await connection();
  return templateProductMetadata(KIND, await findShowcaseHandle(KIND));
}

// Request-time rendering — same sanctioned opt-in as /products/[handle].
export const instant = false;

export default async function BundleTemplatePage() {
  await connection();
  const handle = await findShowcaseHandle(KIND);
  return <TemplateProductPage detail={StoresynkBundleDetail} handle={handle} kind={KIND} />;
}
