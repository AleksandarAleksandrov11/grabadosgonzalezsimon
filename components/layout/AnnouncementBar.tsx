/** Franja superior con un único aviso, sin animación. */
export function AnnouncementBar() {
  return (
    <div
      className="theme-dark relative z-[60] h-[var(--announce-h)] border-b border-white/10 bg-ink text-paper"
      role="region"
      aria-label="Aviso"
    >
      <p className="container-x flex h-full items-center justify-center text-center text-[0.75rem] font-medium tracking-[0.04em] text-stone-300">
        Envío gratis en pedidos desde 60 €
      </p>
    </div>
  );
}
