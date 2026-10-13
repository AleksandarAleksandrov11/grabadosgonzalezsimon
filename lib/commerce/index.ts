import { localProvider } from "./local-provider";
import type { CommerceProvider } from "./types";

/**
 * Punto único de acceso al comercio. Para migrar a Shopify, sustituir por
 * `shopifyProvider` (lib/commerce/shopify-provider.ts).
 */
export const commerce: CommerceProvider = localProvider;

export * from "./types";
