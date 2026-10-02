// ──────────────────────────────────────────────────────────────────────────
// Modelo de dados do currículo (puro, sem React) — usado pelo motor, store e UI.
// ──────────────────────────────────────────────────────────────────────────

export interface PersonalInfo {
  name: string;
  title: string; // título profissional, ex.: "Engenheira de Software Sênior"
  email: string;
  phone: string;
  city: string; // cidade/UF, ex.: "São Paulo, SP"
  linkedin: string;
  github: string;
  website: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  start: string; // ex.: "Jan 2021"
  end: string; // ex.: "Dez 2023"
  current: boolean; // se true, ignora `end` e mostra "atual"
  location: string;
  bullets: string[]; // realizações
}

export interface Education {
  id: string;
  course: string;
  institution: string;
  start: string;
  end: string;
  status: EducationStatus;
}

export type EducationStatus = "concluido" | "cursando" | "trancado" | "incompleto";

export type SkillKind = "tecnica" | "comportamental";

export interface Skill {
  id: string;
  name: string;
  level: number; // 1–5
  kind: SkillKind;
}

export type LanguageLevel = "basico" | "intermediario" | "avancado" | "fluente" | "nativo";

export interface Language {
  id: string;
  name: string;
  level: LanguageLevel;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface Resume {
  personal: PersonalInfo;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
}

// ── Ajustes de apresentação (modelo / acento / fonte) ──────────────────────

export type TemplateId = "moderno" | "classico" | "compacto";
export type FontScale = "s" | "m" | "l";

export interface Settings {
  template: TemplateId;
  accent: string; // hex
  font: FontScale;
}

// ── Resultado do motor de score (ATS) ──────────────────────────────────────

export type CheckStatus = "ok" | "warn" | "fail";

export interface CheckItem {
  id: string;
  status: CheckStatus;
  text: string;
  /** Pontos obtidos / possíveis deste critério (para exibição opcional). */
  points: number;
  max: number;
}

export interface ScoreResult {
  score: number; // 0–100 (clamp)
  checks: CheckItem[];
}
