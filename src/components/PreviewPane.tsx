import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, FileText, Maximize2 } from "lucide-react";
import { useResume } from "../lib/store";
import { fontScaleClass } from "../data/templates";
import { TemplateModerno } from "./templates/TemplateModerno";
import { TemplateClassico } from "./templates/TemplateClassico";
import { TemplateCompacto } from "./templates/TemplateCompacto";
import { isResumeEmpty } from "./templates/shared";

// Altura de uma folha A4 no preview, em px (210×297mm @ 96dpi → 794×1123).
const PAGE_H = 1123;
const ZOOM_MIN = 50;
const ZOOM_MAX = 100;

export function PreviewPane() {
  const resume = useResume((s) => s.resume);
  const settings = useResume((s) => s.settings);
  const [zoom, setZoom] = useState(70);
  const [pages, setPages] = useState(1);

  const sheetRef = useRef<HTMLDivElement>(null);

  // Mede a altura real do conteúdo e calcula quantas folhas A4 ele ocupa,
  // para desenhar as guias de quebra de página e o contador de páginas.
  useLayoutEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const measure = () => {
      const h = el.scrollHeight;
      setPages(Math.max(1, Math.ceil(h / PAGE_H)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [resume, settings]);

  // Atalho: Ctrl/Cmd + roda do mouse ajusta o zoom dentro do preview.
  useEffect(() => {
    const node = sheetRef.current?.parentElement?.parentElement;
    if (!node) return;
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      setZoom((z) => clampZoom(z + (e.deltaY < 0 ? 5 : -5)));
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, []);

  const empty = isResumeEmpty(resume);
  const Template =
    settings.template === "classico"
      ? TemplateClassico
      : settings.template === "compacto"
        ? TemplateCompacto
        : TemplateModerno;

  return (
    <div className="flex h-full flex-col">
      {/* Barra de controles do preview */}
      <div className="no-print mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <FileText size={14} className="text-brand-400" />
          <span className="font-semibold">Pré-visualização A4</span>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">
            {pages} {pages === 1 ? "página" : "páginas"}
          </span>
          {pages > 1 && (
            <span className="hidden items-center gap-1 text-[11px] text-amber-300 sm:inline-flex">
              · excede uma folha
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => clampZoom(z - 10))}
            disabled={zoom <= ZOOM_MIN}
            className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:opacity-30"
            title="Diminuir zoom"
            aria-label="Diminuir zoom"
          >
            <ZoomOut size={14} />
          </button>
          <span className="w-12 text-center text-xs font-semibold tabular-nums text-slate-300">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => clampZoom(z + 10))}
            disabled={zoom >= ZOOM_MAX}
            className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:opacity-30"
            title="Aumentar zoom"
            aria-label="Aumentar zoom"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setZoom(100)}
            className="ml-1 grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
            title="Zoom 100%"
            aria-label="Zoom 100%"
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      {/* Área rolável com a folha */}
      <div className="relative flex-1 overflow-auto rounded-2xl border border-white/5 bg-ink-950/40 p-4 sm:p-8">
        <div className="mx-auto" style={{ width: 794 * (zoom / 100) }}>
          <div
            style={{
              width: 794,
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top left",
            }}
          >
            {/* #cv-print-root é o que a impressão isola (ver index.css @media print). */}
            <div id="cv-print-root">
              <div
                ref={sheetRef}
                className={`cv-page ${fontScaleClass(settings.font)}`}
                style={{ ["--cv-accent" as string]: settings.accent }}
              >
                {empty ? (
                  <EmptyPreview />
                ) : (
                  <Template resume={resume} accent={settings.accent} />
                )}

                {/* Guias de quebra de página (apenas tela). */}
                {!empty &&
                  Array.from({ length: pages - 1 }).map((_, i) => (
                    <div
                      key={i}
                      className="cv-page-break-guide"
                      style={{ top: PAGE_H * (i + 1) }}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function clampZoom(z: number): number {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(z / 5) * 5));
}

function EmptyPreview() {
  return (
    <div
      style={{
        height: PAGE_H,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8",
        textAlign: "center",
        padding: 40,
        gap: 12,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: "#f1f5f9",
          display: "grid",
          placeItems: "center",
        }}
      >
        <FileText size={30} color="#cbd5e1" />
      </div>
      <p style={{ fontSize: 16, fontWeight: 700, color: "#475569", margin: 0 }}>Seu currículo aparece aqui</p>
      <p style={{ fontSize: 13, maxWidth: 280, lineHeight: 1.5, margin: 0 }}>
        Preencha o formulário à esquerda — ou clique em <strong>Exemplo</strong> no topo para ver um modelo completo.
      </p>
    </div>
  );
}
