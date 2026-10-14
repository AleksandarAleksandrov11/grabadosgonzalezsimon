"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useFocusTrap, useMounted, useScrollLock } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  hideTitle?: boolean;
  children: ReactNode;
  className?: string;
  size?: "md" | "lg" | "xl";
  theme?: "light" | "dark";
};

export function Modal({
  open,
  onClose,
  title,
  hideTitle,
  children,
  className,
  size = "lg",
  theme = "light",
}: ModalProps) {
  const mounted = useMounted();
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useFocusTrap(ref, open, onClose);
  useScrollLock(open);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open ? (
        <div
          className="fixed inset-0 z-[75] flex items-end justify-center sm:items-center sm:p-6"
          data-floating
        >
          <m.div
            className="absolute inset-0 bg-ink/60 backdrop-blur-[4px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <m.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            data-lenis-prevent
            className={cn(
              theme === "dark" ? "theme-dark" : "theme-light",
              "relative max-h-[92dvh] w-full overflow-y-auto overscroll-contain rounded-t-[14px] bg-bg text-fg shadow-[0_30px_120px_rgba(0,0,0,0.45)] outline-none sm:rounded-[var(--radius-lg)]",
              size === "md" && "sm:max-w-lg",
              size === "lg" && "sm:max-w-3xl",
              size === "xl" && "sm:max-w-5xl",
              className,
            )}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className={cn(
                "sticky top-0 z-10 flex items-center justify-between gap-4 bg-bg/90 px-5 py-3 backdrop-blur",
                hideTitle && "absolute inset-x-0 bg-transparent backdrop-blur-none",
              )}
            >
              <h2 id={titleId} className={cn("font-display text-2xl leading-tight", hideTitle && "sr-only")}>
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="ml-auto inline-flex tap items-center justify-center rounded-full bg-bg/70 text-fg backdrop-blur transition-colors hover:bg-fg/10"
                aria-label="Cerrar"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>
            {children}
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
