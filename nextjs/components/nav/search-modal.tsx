"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, type ReactNode } from "react";

import { Dialog, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Thin modal shell around the Storesynk <predictive-search> subtree, which is
// authored server-side in nav/index.tsx (engine-cloned DOM must never be
// React-reconciled, so it arrives through StoresynkStatic as children).
// Closing unmounts the injected HTML; reopening re-inserts it fresh and the
// engine re-upgrades it.
export function SearchModal({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  // Portal INTO <storesynk-store>, not document.body: the engine's store
  // context flows through the DOM tree, and a body-level portal would strand
  // <predictive-search> outside it (blank results, silently). The store is
  // display:contents, so fixed positioning is unaffected.
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setContainer(document.querySelector("storesynk-store"));
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="flex items-center justify-center text-foreground hover:text-foreground/80 transition-colors"
          >
            <Search className="size-5" />
            <span className="sr-only">{t("search")}</span>
          </button>
        }
      />
      <DialogPrimitive.Portal container={container ?? undefined}>
        <DialogPrimitive.Backdrop className="data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 z-60 bg-black/30 backdrop-blur-sm" />
        <DialogPrimitive.Popup
          aria-describedby={undefined}
          className="fixed inset-0 z-60 flex justify-center pt-[15vh] px-4 outline-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-xl h-fit">
            <DialogTitle className="sr-only">{t("search")}</DialogTitle>
            <div className="bg-background rounded-xl shadow-lg overflow-hidden duration-200">
              {children}
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}
