import type {
  EducationStatus,
  LanguageLevel,
  TemplateId,
} from "../types";

// Gera um id curto e único para itens de lista (experiências, skills, etc.).
export function uid(prefix = "id"): string {
  const rand = Math.random().toString(36).slice(2, 8);
  const time = Date.now().toString(36).slice(-4);
  return `${prefix}-${time}${rand}`;
}

export const EDUCATION_STATUS_LABEL: Record<EducationStatus, string> = {
  concluido: "Concluído",
  cursando: "Cursando",
  trancado: "Trancado",
  incompleto: "Incompleto",
};

export const LANGUAGE_LEVEL_LABEL: Record<LanguageLevel, string> = {
  basico: "Básico",
  intermediario: "Intermediário",
  avancado: "Avançado",
  fluente: "Fluente",
  nativo: "Nativo",
};

// Ordem crescente para os níveis de idioma (básico → nativo).
export const LANGUAGE_LEVELS: LanguageLevel[] = [
  "basico",
  "intermediario",
  "avancado",
  "fluente",
  "nativo",
];

export const TEMPLATE_LABEL: Record<TemplateId, string> = {
  moderno: "Moderno",
  classico: "Clássico ATS",
  compacto: "Compacto",
};

// Período "início – fim" tratando o caso "atual".
export function periodLabel(start: string, end: string, current?: boolean): string {
  const s = start.trim();
  const e = current ? "atual" : end.trim();
  if (s && e) return `${s} – ${e}`;
  return s || e || "";
}

// Conta palavras (para o contador do resumo, opcional).
export function wordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}
