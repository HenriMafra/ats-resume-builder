// ──────────────────────────────────────────────────────────────────────────
// Motor de score ATS — PURO (sem React), 100% testável.
//
// Pontuação 0–100 + checklist {ok|warn|fail, texto}:
//   • Essenciais (nome, título, e-mail, telefone, >=1 experiência, >=1 formação)
//       = 40 pts proporcionais (cada um dos 6 vale 40/6).
//   • Resumo entre 200 e 600 caracteres ......................... = 10
//   • >=3 bullets começando com verbo de ação PT-BR ............. = 15
//   • >=2 bullets com números/percentuais ....................... = 10
//   • >=5 habilidades ........................................... = 10
//   • E-mail válido + LinkedIn preenchido ....................... = 10
//   • Nenhum bullet com mais de 220 caracteres .................. = 5
//   Total máximo = 100 (com clamp em 100).
// ──────────────────────────────────────────────────────────────────────────

import type { CheckItem, Resume, ScoreResult } from "../types";
import { startsWithActionVerb } from "../data/verbs";

export const SUMMARY_MIN = 200;
export const SUMMARY_MAX = 600;
export const BULLET_MAX_CHARS = 220;
export const ACTION_BULLET_TARGET = 3;
export const NUMBER_BULLET_TARGET = 2;
export const SKILLS_TARGET = 5;

// Validação de e-mail simples e robusta o suficiente para currículos.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

// Um bullet "tem número" se contém algum dígito (cobre %, R$, anos, métricas).
export function hasNumber(text: string): boolean {
  return /\d/.test(text);
}

// Reexporta para uso na UI/testes mantendo um único ponto de verdade.
export { startsWithActionVerb };

/** Coleta todos os bullets não vazios de todas as experiências. */
export function collectBullets(resume: Resume): string[] {
  const out: string[] = [];
  for (const exp of resume.experiences) {
    // Defesa contra payloads corrompidos onde `bullets` não é um array de strings.
    if (!Array.isArray(exp.bullets)) continue;
    for (const b of exp.bullets) {
      if (typeof b !== "string") continue;
      const t = b.trim();
      if (t) out.push(t);
    }
  }
  return out;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/**
 * Calcula o score ATS e o checklist de um currículo.
 * Determinístico e sem efeitos colaterais.
 */
export function scoreResume(resume: Resume): ScoreResult {
  const checks: CheckItem[] = [];
  let score = 0;

  // ── 1. Essenciais — 40 pts proporcionais (6 itens) ───────────────────────
  const p = resume.personal;
  const essentials: { ok: boolean; label: string }[] = [
    { ok: p.name.trim().length > 0, label: "nome" },
    { ok: p.title.trim().length > 0, label: "título profissional" },
    { ok: p.email.trim().length > 0, label: "e-mail" },
    { ok: p.phone.trim().length > 0, label: "telefone" },
    { ok: resume.experiences.length >= 1, label: "1 experiência" },
    { ok: resume.education.length >= 1, label: "1 formação" },
  ];
  const essentialsDone = essentials.filter((e) => e.ok).length;
  const essentialsTotal = essentials.length; // 6
  const essentialsPoints = (essentialsDone / essentialsTotal) * 40;
  score += essentialsPoints;
  const missingEssentials = essentials.filter((e) => !e.ok).map((e) => e.label);
  checks.push({
    id: "essentials",
    status: essentialsDone === essentialsTotal ? "ok" : essentialsDone >= 4 ? "warn" : "fail",
    text:
      essentialsDone === essentialsTotal
        ? "Todos os campos essenciais preenchidos."
        : `Faltam itens essenciais: ${missingEssentials.join(", ")}.`,
    points: Math.round(essentialsPoints),
    max: 40,
  });

  // ── 2. Resumo entre 200 e 600 caracteres — 10 pts ────────────────────────
  const summaryLen = resume.summary.trim().length;
  const summaryOk = summaryLen >= SUMMARY_MIN && summaryLen <= SUMMARY_MAX;
  if (summaryOk) score += 10;
  checks.push({
    id: "summary",
    status: summaryOk ? "ok" : summaryLen === 0 ? "fail" : "warn",
    text: summaryOk
      ? `Resumo com bom tamanho (${summaryLen} caracteres).`
      : summaryLen === 0
        ? "Adicione um resumo profissional (entre 200 e 600 caracteres)."
        : summaryLen < SUMMARY_MIN
          ? `Resumo curto (${summaryLen}). Ideal entre ${SUMMARY_MIN} e ${SUMMARY_MAX} caracteres.`
          : `Resumo longo (${summaryLen}). Ideal entre ${SUMMARY_MIN} e ${SUMMARY_MAX} caracteres.`,
    points: summaryOk ? 10 : 0,
    max: 10,
  });

  // Bullets (usados por 3 critérios).
  const bullets = collectBullets(resume);

  // ── 3. >=3 bullets começando com verbo de ação — 15 pts ──────────────────
  const actionCount = bullets.filter((b) => startsWithActionVerb(b)).length;
  const actionOk = actionCount >= ACTION_BULLET_TARGET;
  if (actionOk) score += 15;
  checks.push({
    id: "action-verbs",
    status: actionOk ? "ok" : actionCount > 0 ? "warn" : "fail",
    text: actionOk
      ? `${actionCount} realizações começam com verbo de ação.`
      : `Use verbos de ação no início dos bullets (${actionCount}/${ACTION_BULLET_TARGET}). Ex.: "Desenvolvi", "Liderei", "Reduzi".`,
    points: actionOk ? 15 : 0,
    max: 15,
  });

  // ── 4. >=2 bullets com números/percentuais — 10 pts ──────────────────────
  const numberCount = bullets.filter((b) => hasNumber(b)).length;
  const numberOk = numberCount >= NUMBER_BULLET_TARGET;
  if (numberOk) score += 10;
  checks.push({
    id: "numbers",
    status: numberOk ? "ok" : numberCount > 0 ? "warn" : "fail",
    text: numberOk
      ? `${numberCount} realizações trazem números ou percentuais.`
      : `Quantifique resultados com números (${numberCount}/${NUMBER_BULLET_TARGET}). Ex.: "Reduzi o tempo de build em 35%".`,
    points: numberOk ? 10 : 0,
    max: 10,
  });

  // ── 5. >=5 habilidades — 10 pts ──────────────────────────────────────────
  const skillCount = resume.skills.filter((s) => s.name.trim().length > 0).length;
  const skillsOk = skillCount >= SKILLS_TARGET;
  if (skillsOk) score += 10;
  checks.push({
    id: "skills",
    status: skillsOk ? "ok" : skillCount > 0 ? "warn" : "fail",
    text: skillsOk
      ? `${skillCount} habilidades cadastradas.`
      : `Liste pelo menos ${SKILLS_TARGET} habilidades (${skillCount}/${SKILLS_TARGET}).`,
    points: skillsOk ? 10 : 0,
    max: 10,
  });

  // ── 6. E-mail válido + LinkedIn — 10 pts ─────────────────────────────────
  const emailValid = isValidEmail(p.email);
  const linkedinOk = p.linkedin.trim().length > 0;
  const contactsOk = emailValid && linkedinOk;
  if (contactsOk) score += 10;
  checks.push({
    id: "contacts",
    status: contactsOk ? "ok" : emailValid || linkedinOk ? "warn" : "fail",
    text: contactsOk
      ? "E-mail válido e LinkedIn informados."
      : !emailValid && !linkedinOk
        ? "Informe um e-mail válido e o seu LinkedIn."
        : !emailValid
          ? "O e-mail informado parece inválido."
          : "Adicione o link do seu LinkedIn.",
    points: contactsOk ? 10 : 0,
    max: 10,
  });

  // ── 7. Nenhum bullet com mais de 220 caracteres — 5 pts ──────────────────
  const longBullets = bullets.filter((b) => b.length > BULLET_MAX_CHARS).length;
  const lengthOk = longBullets === 0;
  // Só pontua se houver bullets (currículo sem bullets não "ganha" os 5 pts).
  const lengthScored = lengthOk && bullets.length > 0;
  if (lengthScored) score += 5;
  checks.push({
    id: "bullet-length",
    status: bullets.length === 0 ? "fail" : lengthOk ? "ok" : "warn",
    text:
      bullets.length === 0
        ? "Adicione realizações (bullets) às suas experiências."
        : lengthOk
          ? "Todos os bullets têm tamanho adequado."
          : `${longBullets} bullet(s) passam de ${BULLET_MAX_CHARS} caracteres — seja mais conciso.`,
    points: lengthScored ? 5 : 0,
    max: 5,
  });

  return { score: clamp(Math.round(score), 0, 100), checks };
}
