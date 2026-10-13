"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useFocusTrap, useIsDesktop, useMounted, useScrollLock } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** "right": lateral en desktop y bottom sheet a pantalla completa en móvil */
  side?: "right" | "left" | "bottom";
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  theme?: "light" | "dark";
  /** alto del bottom sheet en móvil */
  mobileHeight?: "full" | "auto";
  headerExtra?: ReactNode;
};

export function Drawer({
  open,
  onClose,
  title,
  side = "right",
  children,
  footer,
  className,
  theme = "light",
  mobileHeight = "full",
  headerExtra,
}: DrawerProps) {
  const mounted = useMounted();
  const isDesktop = useIsDesktop();
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useFocusTrap(ref, open, onClose);
  useScrollLock(open);

  if (!mounted) return null;
  const asSheet = side === "bottom" || !isDesktop;
  const from = asSheet
    ? { y: "100%", x: 0 }
    : side === "left"
      ? { x: "-100%", y: 0 }
      : { x: "100%", y: 0 };

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[70]" data-floating>
          <m.div
            className="absolute inset-0 bg-ink/55 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
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
              "absolute flex flex-col bg-bg text-fg shadow-[0_0_80px_rgba(0,0,0,0.35)] outline-none",
              asSheet
                ? cn(
                    "inset-x-0 bottom-0 rounded-t-[14px]",
                    mobileHeight === "full" ? "h-[100dvh] max-h-[100dvh] rounded-t-none" : "max-h-[88dvh]",
                  )
                : cn("inset-y-0 w-full max-w-[460px]", side === "left" ? "left-0" : "right-0"),
              className,
            )}
            initial={from}
            animate={{ x: 0, y: 0 }}
            exit={from}
            transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.55 }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
              <h2 id={titleId} className="font-display text-2xl leading-none">
                {title}
              </h2>
              <div className="flex items-center gap-2">
                {headerExtra}
                <button
                  type="button"
                  onClick={onClose}
                  className="tap -mr-2 inline-flex items-center justify-center rounded-full text-fg transition-colors hover:bg-fg/8"
                  aria-label="Cerrar"
                >
                  <X className="size-5" strokeWidth={1.5} />
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
            {footer ? <div className="border-t border-line px-5 pt-4 safe-bottom sm:px-6">{footer}</div> : null}
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
