import { create } from "zustand";
import type {
  Certification,
  Education,
  Experience,
  Language,
  PersonalInfo,
  Project,
  Resume,
  Settings,
  Skill,
} from "../types";
import { emptyResume } from "../data/empty";
import { DEFAULT_ACCENT } from "../data/templates";

const LS_KEY = "curriculoforge:state";

interface PersistShape {
  resume: Resume;
  settings: Settings;
}

const DEFAULT_SETTINGS: Settings = {
  template: "moderno",
  accent: DEFAULT_ACCENT,
  font: "m",
};

const VALID_TEMPLATES: ReadonlySet<string> = new Set(["moderno", "classico", "compacto"]);
const VALID_FONTS: ReadonlySet<string> = new Set(["s", "m", "l"]);

// Filtra um payload de settings (de import/compartilhamento) mantendo só os
// valores reconhecidos — evita modelo/fonte/acento inválidos vindos de fora.
export function sanitizeSettings(partial?: Partial<Settings> | unknown): Partial<Settings> {
  if (!partial || typeof partial !== "object") return {};
  const p = partial as Record<string, unknown>;
  const out: Partial<Settings> = {};
  if (typeof p.template === "string" && VALID_TEMPLATES.has(p.template)) {
    out.template = p.template as Settings["template"];
  }
  if (typeof p.font === "string" && VALID_FONTS.has(p.font)) {
    out.font = p.font as Settings["font"];
  }
  // Acento: aceita apenas hex curto/longo (#rgb ou #rrggbb) para evitar injeção
  // de valores arbitrários no estilo inline `--cv-accent`.
  if (typeof p.accent === "string" && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(p.accent.trim())) {
    out.accent = p.accent.trim();
  }
  return out;
}

// ── Persistência manual em localStorage ────────────────────────────────────
function persist(state: PersistShape) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    /* ignora quota / modo privado */
  }
}

function loadPersisted(): PersistShape {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { resume: emptyResume(), settings: { ...DEFAULT_SETTINGS } };
    const parsed = JSON.parse(raw) as Partial<PersistShape>;
    return {
      resume: mergeResume(parsed.resume),
      settings: { ...DEFAULT_SETTINGS, ...sanitizeSettings(parsed.settings) },
    };
  } catch {
    return { resume: emptyResume(), settings: { ...DEFAULT_SETTINGS } };
  }
}

// Coage qualquer valor para string (payloads importados/compartilhados podem
// trazer null/number/objeto onde a UI espera string — evita crash no .trim()).
function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

// Mantém só itens que são objetos com `id` string (descarta lixo de payloads
// corrompidos sem derrubar a tela).
function sanitizeList<T extends { id: string }>(value: unknown): T[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is T =>
      !!item && typeof item === "object" && typeof (item as { id?: unknown }).id === "string"
  );
}

// Garante que todos os arrays existam e que os campos pessoais sejam strings,
// mesmo em payloads antigos/parciais/corrompidos.
export function mergeResume(partial?: Partial<Resume>): Resume {
  const base = emptyResume();
  if (!partial || typeof partial !== "object") return base;
  const p = (partial.personal ?? {}) as Record<string, unknown>;
  return {
    personal: {
      name: str(p.name),
      title: str(p.title),
      email: str(p.email),
      phone: str(p.phone),
      city: str(p.city),
      linkedin: str(p.linkedin),
      github: str(p.github),
      website: str(p.website),
    },
    summary: str(partial.summary),
    experiences: sanitizeList(partial.experiences),
    education: sanitizeList(partial.education),
    skills: sanitizeList(partial.skills),
    languages: sanitizeList(partial.languages),
    certifications: sanitizeList(partial.certifications),
    projects: sanitizeList(partial.projects),
  };
}

// Move um item dentro de um array (reordenação) sem mutar o original.
function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from < 0 || from >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

interface ResumeState {
  resume: Resume;
  settings: Settings;

  // Carregamento em massa (exemplo / import / share)
  loadResume: (resume: Resume) => void;
  resetResume: () => void;

  // Dados pessoais & resumo
  updatePersonal: (patch: Partial<PersonalInfo>) => void;
  updateSummary: (summary: string) => void;

  // Settings (modelo / acento / fonte)
  updateSettings: (patch: Partial<Settings>) => void;

  // Experiências
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, patch: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  moveExperience: (id: string, dir: -1 | 1) => void;
  addBullet: (expId: string) => void;
  updateBullet: (expId: string, index: number, text: string) => void;
  removeBullet: (expId: string, index: number) => void;
  moveBullet: (expId: string, index: number, dir: -1 | 1) => void;

  // Formação
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, patch: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  moveEducation: (id: string, dir: -1 | 1) => void;

  // Habilidades
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, patch: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  moveSkill: (id: string, dir: -1 | 1) => void;

  // Idiomas
  addLanguage: (lang: Language) => void;
  updateLanguage: (id: string, patch: Partial<Language>) => void;
  removeLanguage: (id: string) => void;

  // Certificações
  addCertification: (cert: Certification) => void;
  updateCertification: (id: string, patch: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  moveCertification: (id: string, dir: -1 | 1) => void;

  // Projetos
  addProject: (proj: Project) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;
  moveProject: (id: string, dir: -1 | 1) => void;
}

const initial = loadPersisted();

export const useResume = create<ResumeState>((set, get) => {
  // Helper: aplica uma transformação no resume, salva e atualiza o estado.
  const mutate = (fn: (r: Resume) => Resume) => {
    const resume = fn(get().resume);
    persist({ resume, settings: get().settings });
    set({ resume });
  };

  const updateList = <K extends keyof Resume>(
    key: K,
    id: string,
    patch: Partial<Resume[K] extends Array<infer U> ? U : never>
  ) =>
    mutate((r) => ({
      ...r,
      [key]: (r[key] as unknown as { id: string }[]).map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    }));

  const removeFromList = <K extends keyof Resume>(key: K, id: string) =>
    mutate((r) => ({
      ...r,
      [key]: (r[key] as unknown as { id: string }[]).filter((item) => item.id !== id),
    }));

  const moveInList = <K extends keyof Resume>(key: K, id: string, dir: -1 | 1) =>
    mutate((r) => {
      const list = r[key] as unknown as { id: string }[];
      const idx = list.findIndex((item) => item.id === id);
      if (idx === -1) return r;
      return { ...r, [key]: moveItem(list, idx, idx + dir) } as Resume;
    });

  return {
    resume: initial.resume,
    settings: initial.settings,

    loadResume: (resume) => {
      const merged = mergeResume(resume);
      persist({ resume: merged, settings: get().settings });
      set({ resume: merged });
    },

    resetResume: () => {
      const resume = emptyResume();
      persist({ resume, settings: get().settings });
      set({ resume });
    },

    updatePersonal: (patch) =>
      mutate((r) => ({ ...r, personal: { ...r.personal, ...patch } })),

    updateSummary: (summary) => mutate((r) => ({ ...r, summary })),

    updateSettings: (patch) => {
      const settings = { ...get().settings, ...patch };
      persist({ resume: get().resume, settings });
      set({ settings });
    },

    // ── Experiências ─────────────────────────────────────────────────────
    addExperience: (exp) => mutate((r) => ({ ...r, experiences: [...r.experiences, exp] })),
    updateExperience: (id, patch) => updateList("experiences", id, patch),
    removeExperience: (id) => removeFromList("experiences", id),
    moveExperience: (id, dir) => moveInList("experiences", id, dir),

    addBullet: (expId) =>
      mutate((r) => ({
        ...r,
        experiences: r.experiences.map((e) =>
          e.id === expId ? { ...e, bullets: [...e.bullets, ""] } : e
        ),
      })),
    updateBullet: (expId, index, text) =>
      mutate((r) => ({
        ...r,
        experiences: r.experiences.map((e) =>
          e.id === expId
            ? { ...e, bullets: e.bullets.map((b, i) => (i === index ? text : b)) }
            : e
        ),
      })),
    removeBullet: (expId, index) =>
      mutate((r) => ({
        ...r,
        experiences: r.experiences.map((e) =>
          e.id === expId ? { ...e, bullets: e.bullets.filter((_, i) => i !== index) } : e
        ),
      })),
    moveBullet: (expId, index, dir) =>
      mutate((r) => ({
        ...r,
        experiences: r.experiences.map((e) =>
          e.id === expId ? { ...e, bullets: moveItem(e.bullets, index, index + dir) } : e
        ),
      })),

    // ── Formação ─────────────────────────────────────────────────────────
    addEducation: (edu) => mutate((r) => ({ ...r, education: [...r.education, edu] })),
    updateEducation: (id, patch) => updateList("education", id, patch),
    removeEducation: (id) => removeFromList("education", id),
    moveEducation: (id, dir) => moveInList("education", id, dir),

    // ── Habilidades ──────────────────────────────────────────────────────
    addSkill: (skill) => mutate((r) => ({ ...r, skills: [...r.skills, skill] })),
    updateSkill: (id, patch) => updateList("skills", id, patch),
    removeSkill: (id) => removeFromList("skills", id),
    moveSkill: (id, dir) => moveInList("skills", id, dir),

    // ── Idiomas ──────────────────────────────────────────────────────────
    addLanguage: (lang) => mutate((r) => ({ ...r, languages: [...r.languages, lang] })),
    updateLanguage: (id, patch) => updateList("languages", id, patch),
    removeLanguage: (id) => removeFromList("languages", id),

    // ── Certificações ────────────────────────────────────────────────────
    addCertification: (cert) =>
      mutate((r) => ({ ...r, certifications: [...r.certifications, cert] })),
    updateCertification: (id, patch) => updateList("certifications", id, patch),
    removeCertification: (id) => removeFromList("certifications", id),
    moveCertification: (id, dir) => moveInList("certifications", id, dir),

    // ── Projetos ─────────────────────────────────────────────────────────
    addProject: (proj) => mutate((r) => ({ ...r, projects: [...r.projects, proj] })),
    updateProject: (id, patch) => updateList("projects", id, patch),
    removeProject: (id) => removeFromList("projects", id),
    moveProject: (id, dir) => moveInList("projects", id, dir),
  };
});

// Exporta um snapshot serializável (usado no compartilhamento e no export JSON).
export function exportPayload(): PersistShape {
  const { resume, settings } = useResume.getState();
  return { resume, settings };
}
