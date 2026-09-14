"use client";

import type { UIMessage } from "ai";
import { isToolUIPart } from "ai";
import { useEffect, useRef } from "react";

const CART_TOOL_NAMES = new Set([
  "addCartNote",
  "addToCart",
  "getCart",
  "removeFromCart",
  "updateCartItemQuantity",
]);

type StandardActions = {
  getCart: () => Promise<unknown>;
  openCart: () => void;
};

// The agent mutates the shared shopify_cartId cart server-side; reconcile the
// storefront through the standard actions the Storesynk runtime installs —
// getCart refreshes the cart every Storesynk component renders from, openCart
// opens the drawer. No React cart state involved.
export function CartReconciler({ messages }: { messages: readonly UIMessage[] }) {
  const processedToolCalls = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      for (const message of messages) {
        for (const part of message.parts) {
          if (isToolUIPart(part)) processedToolCalls.current.add(part.toolCallId);
        }
      }
      initialized.current = true;
      return;
    }

    for (const message of messages) {
      if (message.role !== "assistant") continue;
      for (const part of message.parts) {
        if (!isToolUIPart(part)) continue;
        const toolName = part.type === "dynamic-tool" ? part.toolName : part.type.slice(5);
        if (!CART_TOOL_NAMES.has(toolName)) continue;
        if (part.state !== "output-available" || processedToolCalls.current.has(part.toolCallId)) {
          continue;
        }
        processedToolCalls.current.add(part.toolCallId);
        const result = part.output as { success?: boolean };
        if (!result?.success) continue;
        const actions = (globalThis as { Shopify?: { actions?: StandardActions } }).Shopify
          ?.actions;
        if (!actions) continue;
        void actions.getCart();
        if (toolName !== "getCart") actions.openCart();
      }
    }
  }, [messages]);

  return null;
}
