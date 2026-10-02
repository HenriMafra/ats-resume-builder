import { FileText, Sparkles, Upload, Download, Trash2, Share2, Printer, Check } from "lucide-react";

export function Header({
  onSample,
  onImport,
  onExport,
  onReset,
  onShare,
  onPrint,
  sharing,
  shared,
  hasContent,
}: {
  onSample: () => void;
  onImport: () => void;
  onExport: () => void;
  onReset: () => void;
  onShare: () => void;
  onPrint: () => void;
  sharing: boolean;
  shared: boolean;
  hasContent: boolean;
}) {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-white/5 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-neon-cyan shadow-glow">
          <FileText size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-white">
            CurriculoForge
            <span className="hidden rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-400 sm:inline">
              currículo profissional
            </span>
          </h1>
          <p className="hidden truncate text-[11px] text-slate-500 sm:block">
            Preview ao vivo em A4 · análise de compatibilidade com ATS · exporta em PDF
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button onClick={onSample} className="btn-ghost !py-1.5 !px-3 text-xs" title="Carregar currículo de exemplo">
            <Sparkles size={14} className="text-neon-amber" />
            <span className="hidden md:inline">Exemplo</span>
          </button>
          <button onClick={onImport} className="btn-ghost !py-1.5 !px-3 text-xs" title="Importar JSON">
            <Upload size={14} />
            <span className="hidden lg:inline">Importar</span>
          </button>
          <button onClick={onExport} className="btn-ghost !py-1.5 !px-3 text-xs" title="Exportar JSON">
            <Download size={14} />
            <span className="hidden lg:inline">Exportar</span>
          </button>
          {hasContent && (
            <button
              onClick={onReset}
              className="btn !py-1.5 !px-2.5 text-xs text-rose-300 hover:bg-rose-500/10"
              title="Limpar tudo"
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            onClick={onShare}
            disabled={sharing}
            className="btn-ghost !py-1.5 !px-3 text-xs"
            title="Compartilhar por código"
          >
            {shared ? <Check size={14} className="text-emerald-300" /> : <Share2 size={14} />}
            <span className="hidden md:inline">{sharing ? "Gerando…" : shared ? "Copiado!" : "Compartilhar"}</span>
          </button>
          <button onClick={onPrint} className="btn-primary !py-1.5 !px-3 text-xs" title="Baixar em PDF (imprimir)">
            <Printer size={14} />
            <span className="hidden sm:inline">Baixar PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
}
