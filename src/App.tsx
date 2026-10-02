import { useEffect, useRef, useState } from "react";
import { Palette, Gauge, Check, Link2, X } from "lucide-react";
import { useResume, exportPayload, mergeResume, sanitizeSettings } from "./lib/store";
import { saveShare, loadShare } from "./lib/api";
import type { Resume, Settings } from "./types";
import { SAMPLE_RESUME } from "./data/sample";

import { Header } from "./components/Header";
import { FormPanel } from "./components/FormPanel";
import { PreviewPane } from "./components/PreviewPane";
import { TemplateBar } from "./components/TemplateBar";
import { AnalysisPanel } from "./components/AnalysisPanel";

type SidePanel = "modelo" | "analise";
type Toast = { kind: "ok" | "error" | "info"; text: string } | null;

interface SharePayload {
  resume?: Partial<Resume>;
  settings?: Partial<Settings>;
}

export default function App() {
  const resume = useResume((s) => s.resume);
  const loadResume = useResume((s) => s.loadResume);
  const resetResume = useResume((s) => s.resetResume);
  const updateSettings = useResume((s) => s.updateSettings);

  const [panel, setPanel] = useState<SidePanel>("modelo");
  const [toast, setToast] = useState<Toast>(null);
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const hasContent = !isPristine(resume);

  // Toast com auto-dismiss.
  function flash(t: NonNullable<Toast>, ms = 3200) {
    setToast(t);
    window.setTimeout(() => setToast((cur) => (cur === t ? null : cur)), ms);
  }

  // Importa um currículo compartilhado por ?c=CODE no carregamento.
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("c");
    if (!code) return;
    void loadShare(code).then((payload) => {
      if (payload && typeof payload === "object") {
        const p = payload as SharePayload;
        loadResume(mergeResume(p.resume));
        const s = sanitizeSettings(p.settings);
        if (Object.keys(s).length) updateSettings(s);
        flash({ kind: "ok", text: "Currículo compartilhado carregado!" });
      } else {
        flash({ kind: "error", text: "Código de compartilhamento não encontrado." });
      }
      // Limpa o parâmetro da URL.
      window.history.replaceState(null, "", window.location.pathname);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Ações globais ──────────────────────────────────────────────────────
  function onSample() {
    if (
      hasContent &&
      !window.confirm("Carregar o currículo de exemplo vai substituir o conteúdo atual. Continuar?")
    ) {
      return;
    }
    loadResume(JSON.parse(JSON.stringify(SAMPLE_RESUME)) as Resume);
    flash({ kind: "ok", text: "Currículo de exemplo carregado." });
  }

  function onReset() {
    if (!hasContent) return;
    if (window.confirm("Tem certeza que deseja limpar todo o currículo? Esta ação não pode ser desfeita.")) {
      resetResume();
      flash({ kind: "info", text: "Currículo limpo." });
    }
  }

  function onExport() {
    const data = exportPayload();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const name = data.resume.personal.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    a.href = url;
    a.download = `curriculo-${name || "curriculoforge"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    flash({ kind: "ok", text: "JSON exportado." });
  }

  function onImportClick() {
    fileRef.current?.click();
  }

  function onImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // permite reimportar o mesmo arquivo
    if (!file) return;
    if (
      hasContent &&
      !window.confirm("Importar vai substituir o currículo atual. Deseja continuar?")
    ) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as unknown;
        if (!parsed || typeof parsed !== "object") {
          flash({ kind: "error", text: "Arquivo JSON inválido." });
          return;
        }
        const obj = parsed as SharePayload;
        // Aceita tanto { resume, settings } quanto um Resume "cru".
        loadResume(mergeResume(obj.resume ?? (obj as Partial<Resume>)));
        const s = sanitizeSettings(obj.settings);
        if (Object.keys(s).length) updateSettings(s);
        flash({ kind: "ok", text: "Currículo importado com sucesso." });
      } catch {
        flash({ kind: "error", text: "Arquivo JSON inválido." });
      }
    };
    reader.onerror = () => flash({ kind: "error", text: "Não foi possível ler o arquivo." });
    reader.readAsText(file);
  }

  async function onShare() {
    setSharing(true);
    setShared(false);
    try {
      const code = await saveShare(exportPayload());
      const url = `${window.location.origin}${window.location.pathname}?c=${code}`;
      setShareUrl(url);
      let copied = false;
      try {
        await navigator.clipboard.writeText(url);
        copied = true;
      } catch {
        /* clipboard bloqueado */
      }
      setShared(copied);
      flash({ kind: "ok", text: copied ? `Link copiado! Código: ${code}` : `Código gerado: ${code}` });
      if (copied) window.setTimeout(() => setShared(false), 2500);
    } catch {
      flash({ kind: "error", text: "Não foi possível gerar o link." });
    } finally {
      setSharing(false);
    }
  }

  function onPrint() {
    window.print();
  }

  return (
    <div className="min-h-screen">
      <Header
        onSample={onSample}
        onImport={onImportClick}
        onExport={onExport}
        onReset={onReset}
        onShare={onShare}
        onPrint={onPrint}
        sharing={sharing}
        shared={shared}
        hasContent={hasContent}
      />

      <input ref={fileRef} type="file" accept="application/json,.json" onChange={onImportFile} className="hidden" />

      {/* hero curto */}
      <section className="no-print mx-auto max-w-[1600px] px-4 pt-6">
        <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
          Monte um currículo que passa pelo robô e impressiona o recrutador.
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">
          Preencha as seções, veja o resultado <span className="text-brand-300">ao vivo em A4</span>, acompanhe seu{" "}
          <span className="text-emerald-300">score de compatibilidade com ATS</span> e{" "}
          <span className="text-neon-cyan">baixe em PDF</span> em um clique.
        </p>
      </section>

      <main className="mx-auto grid max-w-[1600px] grid-cols-1 gap-5 px-4 py-6 xl:grid-cols-12">
        {/* Formulário (esquerda) */}
        <div className="xl:col-span-4">
          <SectionLabel>Conteúdo</SectionLabel>
          <FormPanel />
        </div>

        {/* Preview (centro) */}
        <div className="xl:col-span-5">
          <SectionLabel>Pré-visualização</SectionLabel>
          <div className="xl:sticky xl:top-20 h-[78vh] min-h-[560px]">
            <PreviewPane />
          </div>
        </div>

        {/* Painel lateral com abas (direita) */}
        <div className="xl:col-span-3">
          <SectionLabel>Aparência & Análise</SectionLabel>
          <div className="xl:sticky xl:top-20">
            <div className="card overflow-hidden">
              <div className="flex border-b border-white/5">
                <TabButton active={panel === "modelo"} onClick={() => setPanel("modelo")} icon={Palette} label="Modelo" />
                <TabButton active={panel === "analise"} onClick={() => setPanel("analise")} icon={Gauge} label="Análise ATS" />
              </div>
              <div className="p-4">
                {panel === "modelo" ? <TemplateBar /> : <AnalysisPanel />}
              </div>
            </div>

            {shareUrl && (
              <div className="card mt-3 flex items-center gap-2 p-2.5">
                <Link2 size={14} className="shrink-0 text-brand-400" />
                <input
                  readOnly
                  value={shareUrl}
                  onFocus={(e) => e.currentTarget.select()}
                  aria-label="Link de compartilhamento"
                  className="flex-1 bg-transparent text-[11px] text-slate-300 outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(shareUrl);
                    flash({ kind: "ok", text: "Link copiado!" });
                  }}
                  className="text-slate-400 hover:text-white"
                  title="Copiar link"
                  aria-label="Copiar link"
                >
                  <Check size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="no-print mx-auto max-w-[1600px] px-4 py-8 text-center text-[11px] text-slate-600">
        CurriculoForge · React + Cloudflare Pages + D1
      </footer>

      {/* Toast */}
      {toast && (
        <div className="no-print fixed bottom-4 left-1/2 z-50 -translate-x-1/2 px-4">
          <div
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-card backdrop-blur-md ${
              toast.kind === "ok"
                ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-200"
                : toast.kind === "error"
                  ? "border-rose-500/30 bg-rose-500/15 text-rose-200"
                  : "border-white/10 bg-ink-800/90 text-slate-200"
            }`}
          >
            {toast.kind === "ok" ? <Check size={15} /> : toast.kind === "error" ? <X size={15} /> : null}
            {toast.text}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">{children}</h3>;
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Palette;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition ${
        active ? "text-white" : "text-slate-500 hover:text-slate-300"
      }`}
    >
      <Icon size={14} />
      {label}
      {active && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand-400" />}
    </button>
  );
}

// Currículo "intocado" = igual ao vazio (sem nenhum dado preenchido).
function isPristine(resume: Resume): boolean {
  const p = resume.personal;
  const anyPersonal = Object.values(p).some((v) => v.trim().length > 0);
  return (
    !anyPersonal &&
    !resume.summary.trim() &&
    resume.experiences.length === 0 &&
    resume.education.length === 0 &&
    resume.skills.length === 0 &&
    resume.languages.length === 0 &&
    resume.certifications.length === 0 &&
    resume.projects.length === 0
  );
}
