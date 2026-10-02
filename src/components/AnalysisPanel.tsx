import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, CircleAlert } from "lucide-react";
import { useMemo } from "react";
import { useResume } from "../lib/store";
import { scoreResume } from "../lib/engine";
import { ScoreRing } from "./ScoreRing";
import type { CheckStatus } from "../types";

const STATUS_STYLE: Record<
  CheckStatus,
  { icon: typeof CheckCircle2; color: string; bg: string; border: string }
> = {
  ok: { icon: CheckCircle2, color: "text-emerald-300", bg: "bg-emerald-500/5", border: "border-emerald-500/20" },
  warn: { icon: AlertTriangle, color: "text-amber-300", bg: "bg-amber-400/10", border: "border-amber-400/25" },
  fail: { icon: CircleAlert, color: "text-rose-300", bg: "bg-rose-500/10", border: "border-rose-500/30" },
};

// Ordena: problemas primeiro (fail, warn), depois os OK.
const ORDER: Record<CheckStatus, number> = { fail: 0, warn: 1, ok: 2 };

export function AnalysisPanel() {
  const resume = useResume((s) => s.resume);
  const result = useMemo(() => scoreResume(resume), [resume]);

  const okCount = result.checks.filter((c) => c.status === "ok").length;
  const sorted = [...result.checks].sort((a, b) => ORDER[a.status] - ORDER[b.status]);

  const headline =
    result.score >= 85
      ? "Currículo forte para ATS"
      : result.score >= 55
        ? "Bom — alguns ajustes elevam o score"
        : "Vamos melhorar seu currículo";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <ScoreRing score={result.score} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">{headline}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {okCount}/{result.checks.length} critérios atendidos
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${result.score}%`,
                background:
                  result.score >= 85 ? "#34d399" : result.score >= 55 ? "#fbbf24" : "#fb7185",
              }}
            />
          </div>
        </div>
      </div>

      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {sorted.map((check) => {
            const s = STATUS_STYLE[check.status];
            const Icon = s.icon;
            return (
              <motion.li
                key={check.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={`flex items-start gap-2.5 rounded-xl border ${s.border} ${s.bg} px-3 py-2.5`}
              >
                <Icon size={16} className={`${s.color} mt-0.5 shrink-0`} />
                <p className="flex-1 text-xs leading-snug text-slate-300">{check.text}</p>
                <span className={`shrink-0 text-[11px] font-bold tabular-nums ${s.color}`}>
                  {check.points}/{check.max}
                </span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      <p className="rounded-lg border border-white/5 bg-ink-900/50 px-3 py-2 text-[11px] leading-relaxed text-slate-500">
        A pontuação simula a leitura por sistemas de triagem (ATS): campos essenciais, resumo no
        tamanho certo, realizações com verbos de ação e números, habilidades e contatos válidos.
      </p>
    </div>
  );
}
