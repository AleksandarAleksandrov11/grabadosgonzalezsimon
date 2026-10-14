"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { mapsEmbedUrl, mapsUrl } from "@/data/site";

/** Mapa de Google que solo se carga al pulsar (sin cookies de terceros hasta entonces). */
export function MapEmbed() {
  const [on, setOn] = useState(false);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface-2 sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[420px]">
      {on ? (
        <iframe
          src={mapsEmbedUrl()}
          title="Mapa: ubicación del taller"
          className="absolute inset-0 size-full grayscale"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_50%_40%,var(--surface),var(--surface-2))] p-6 text-center">
          <svg aria-hidden="true" className="absolute inset-0 size-full text-fg/[0.06]">
            <defs>
              <pattern id="map-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M32 0H0v32" fill="none" stroke="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#map-grid)" />
          </svg>
          <span className="relative inline-flex size-14 items-center justify-center rounded-full bg-fg text-bg">
            <MapPin className="size-6" strokeWidth={1.5} />
          </span>
          <p className="relative max-w-[36ch] text-[0.875rem] text-fg-muted">
            Al cargar el mapa, Google puede usar cookies propias.
          </p>
          <div className="relative flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setOn(true)}
              className="inline-flex min-h-11 items-center rounded-full bg-fg px-5 text-[0.875rem] font-semibold text-bg"
            >
              Cargar mapa
            </button>
            <a
              href={mapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 text-[0.875rem] font-semibold"
            >
              Abrir en Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
