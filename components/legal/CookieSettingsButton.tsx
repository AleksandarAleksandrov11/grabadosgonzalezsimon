"use client";

import { Button } from "@/components/ui/Button";
import { openCookieSettings } from "@/components/layout/Floating";

export function CookieSettingsButton() {
  return (
    <Button variant="outline" onClick={openCookieSettings}>
      Configurar cookies
    </Button>
  );
}
