import { Fragment } from "react";

/** Convierte «texto con *énfasis*» en texto con <em> (titulares editoriales). */
export function Emph({ text, className = "font-light" }: { text: string; className?: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/).map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <em key={i} className={className}>
            {part.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Versión en texto plano (metadatos, aria-labels). */
export const plainEmph = (text: string) => text.replace(/\*/g, "");
