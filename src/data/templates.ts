import type { FontScale, TemplateId } from "../types";

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  tagline: string;
  /** true se o modelo usa fundo colorido (exige print-color-adjust). */
  colored: boolean;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "moderno",
    name: "Moderno",
    tagline: "Coluna lateral colorida com contatos e habilidades",
    colored: true,
  },
  {
    id: "classico",
    name: "Clássico ATS",
    tagline: "Uma coluna sóbria, sem ornamentos — ideal para ATS",
    colored: false,
  },
  {
    id: "compacto",
    name: "Compacto",
    tagline: "Denso, duas colunas de conteúdo para caber mais",
    colored: false,
  },
];

// 6 cores de acento.
export interface AccentOption {
  id: string;
  label: string;
  value: string; // hex
}

export const ACCENTS: AccentOption[] = [
  { id: "azul", label: "Azul", value: "#5aa2ff" },
  { id: "esmeralda", label: "Esmeralda", value: "#10b981" },
  { id: "violeta", label: "Violeta", value: "#8b5cf6" },
  { id: "ambar", label: "Âmbar", value: "#f59e0b" },
  { id: "rosa", label: "Rosa", value: "#ec4899" },
  { id: "grafite", label: "Grafite", value: "#475569" },
];

export const DEFAULT_ACCENT = ACCENTS[0].value;

export const FONT_SCALES: { id: FontScale; label: string }[] = [
  { id: "s", label: "P" },
  { id: "m", label: "M" },
  { id: "l", label: "G" },
];

export function fontScaleClass(font: FontScale): string {
  return font === "s" ? "cv-font-s" : font === "l" ? "cv-font-l" : "cv-font-m";
}
