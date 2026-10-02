import { Check } from "lucide-react";
import { useResume } from "../lib/store";
import { TEMPLATES, ACCENTS, FONT_SCALES } from "../data/templates";
import type { TemplateId } from "../types";

// Miniatura SVG esquemática de cada modelo (usa o acento atual).
function Thumb({ template, accent }: { template: TemplateId; accent: string }) {
  if (template === "moderno") {
    return (
      <svg viewBox="0 0 60 80" className="h-full w-full">
        <rect width="60" height="80" rx="3" fill="#fff" />
        <rect width="22" height="80" rx="0" fill={accent} />
        <rect x="5" y="8" width="12" height="12" rx="6" fill="#fff" opacity="0.85" />
        <rect x="4" y="26" width="14" height="2.5" rx="1.25" fill="#fff" opacity="0.7" />
        <rect x="4" y="32" width="14" height="2.5" rx="1.25" fill="#fff" opacity="0.7" />
        <rect x="4" y="38" width="10" height="2.5" rx="1.25" fill="#fff" opacity="0.7" />
        <rect x="28" y="10" width="26" height="4" rx="2" fill="#1f2937" />
        <rect x="28" y="18" width="18" height="3" rx="1.5" fill={accent} />
        <rect x="28" y="30" width="27" height="2.5" rx="1.25" fill="#cbd5e1" />
        <rect x="28" y="36" width="27" height="2.5" rx="1.25" fill="#cbd5e1" />
        <rect x="28" y="42" width="20" height="2.5" rx="1.25" fill="#cbd5e1" />
        <rect x="28" y="54" width="27" height="2.5" rx="1.25" fill="#cbd5e1" />
        <rect x="28" y="60" width="22" height="2.5" rx="1.25" fill="#cbd5e1" />
      </svg>
    );
  }
  if (template === "classico") {
    return (
      <svg viewBox="0 0 60 80" className="h-full w-full">
        <rect width="60" height="80" rx="3" fill="#fff" />
        <rect x="14" y="9" width="32" height="4" rx="2" fill="#1f2937" />
        <rect x="20" y="16" width="20" height="2.5" rx="1.25" fill="#64748b" />
        <line x1="8" y1="24" x2="52" y2="24" stroke="#1f2937" strokeWidth="1" />
        <rect x="8" y="29" width="16" height="3" rx="1.5" fill="#334155" />
        <rect x="8" y="35" width="44" height="2.2" rx="1.1" fill="#cbd5e1" />
        <rect x="8" y="40" width="44" height="2.2" rx="1.1" fill="#cbd5e1" />
        <rect x="8" y="48" width="16" height="3" rx="1.5" fill="#334155" />
        <rect x="8" y="54" width="44" height="2.2" rx="1.1" fill="#cbd5e1" />
        <rect x="8" y="59" width="40" height="2.2" rx="1.1" fill="#cbd5e1" />
        <rect x="8" y="64" width="44" height="2.2" rx="1.1" fill="#cbd5e1" />
      </svg>
    );
  }
  // compacto
  return (
    <svg viewBox="0 0 60 80" className="h-full w-full">
      <rect width="60" height="80" rx="3" fill="#fff" />
      <rect x="6" y="7" width="30" height="3.5" rx="1.75" fill="#1f2937" />
      <rect x="6" y="13" width="18" height="2.2" rx="1.1" fill={accent} />
      <line x1="6" y1="20" x2="54" y2="20" stroke="#e2e8f0" strokeWidth="1" />
      <rect x="6" y="24" width="22" height="2.6" rx="1.3" fill="#334155" />
      <rect x="6" y="29" width="22" height="2" rx="1" fill="#cbd5e1" />
      <rect x="6" y="33" width="22" height="2" rx="1" fill="#cbd5e1" />
      <rect x="6" y="40" width="22" height="2.6" rx="1.3" fill="#334155" />
      <rect x="6" y="45" width="22" height="2" rx="1" fill="#cbd5e1" />
      <rect x="32" y="24" width="22" height="2.6" rx="1.3" fill="#334155" />
      <rect x="32" y="29" width="22" height="2" rx="1" fill="#cbd5e1" />
      <rect x="32" y="33" width="22" height="2" rx="1" fill="#cbd5e1" />
      <rect x="32" y="40" width="22" height="2.6" rx="1.3" fill="#334155" />
      <rect x="32" y="45" width="22" height="2" rx="1" fill="#cbd5e1" />
    </svg>
  );
}

export function TemplateBar() {
  const settings = useResume((s) => s.settings);
  const update = useResume((s) => s.updateSettings);

  return (
    <div className="space-y-4">
      {/* Modelos */}
      <div>
        <p className="label mb-2">Modelo</p>
        <div className="grid grid-cols-3 gap-2">
          {TEMPLATES.map((t) => {
            const active = settings.template === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => update({ template: t.id })}
                title={t.tagline}
                aria-pressed={active}
                className={`group relative overflow-hidden rounded-xl border p-1.5 text-left transition ${
                  active
                    ? "border-brand-400/70 bg-brand-500/10 shadow-glow"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="aspect-[3/4] overflow-hidden rounded-md ring-1 ring-black/5">
                  <Thumb template={t.id} accent={settings.accent} />
                </div>
                <p className="mt-1.5 px-0.5 text-[11px] font-semibold text-slate-200">{t.name}</p>
                {active && (
                  <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-brand-500 text-white">
                    <Check size={11} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Cor de acento */}
        <div>
          <p className="label mb-2">Cor de acento</p>
          <div className="flex flex-wrap gap-2">
            {ACCENTS.map((a) => {
              const active = settings.accent === a.value;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => update({ accent: a.value })}
                  title={a.label}
                  aria-label={`Acento ${a.label}`}
                  aria-pressed={active}
                  className={`grid h-7 w-7 place-items-center rounded-full ring-2 ring-offset-2 ring-offset-ink-850 transition ${
                    active ? "ring-white/80" : "ring-transparent hover:ring-white/30"
                  }`}
                  style={{ background: a.value }}
                >
                  {active && <Check size={13} className="text-white drop-shadow" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tamanho da fonte */}
        <div>
          <p className="label mb-2">Tamanho da fonte</p>
          <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-0.5">
            {FONT_SCALES.map((f) => {
              const active = settings.font === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => update({ font: f.id })}
                  aria-pressed={active}
                  title={`Fonte ${f.label}`}
                  className={`h-7 w-9 rounded-lg text-sm font-bold transition ${
                    active ? "bg-brand-500 text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
