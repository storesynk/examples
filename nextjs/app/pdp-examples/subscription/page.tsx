import type { Metadata } from "next";
import { connection } from "next/server";

import { StoresynkSubscriptionDetail } from "@/components/product/storesynk-detail-subscription";
import { TemplateProductPage, templateProductMetadata } from "@/components/product/template-page";

// Subscriptions are not a Storesynk app feature, so this demo keeps a fixed showcase
// product (a product with selling plans) and stays out of the nav menu.
const HANDLE = "kenya-nyeri-cold-brewed-coffee";

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  return templateProductMetadata("subscription", HANDLE);
}

// Request-time rendering — same sanctioned opt-in as /products/[handle].
export const instant = false;

export default async function SubscriptionTemplatePage() {
  await connection();
  return (
    <TemplateProductPage detail={StoresynkSubscriptionDetail} handle={HANDLE} kind="subscription" />
  );
}
