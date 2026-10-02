import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import type { Resume } from "../../types";
import { EDUCATION_STATUS_LABEL, LANGUAGE_LEVEL_LABEL, periodLabel } from "../../lib/format";

export interface TemplateProps {
  resume: Resume;
  accent: string;
}

// Lista de contatos disponíveis (rótulo + ícone).
export function contactList(resume: Resume) {
  const p = resume.personal;
  const items: { icon: typeof Mail; value: string }[] = [];
  if (p.email) items.push({ icon: Mail, value: p.email });
  if (p.phone) items.push({ icon: Phone, value: p.phone });
  if (p.city) items.push({ icon: MapPin, value: p.city });
  if (p.linkedin) items.push({ icon: Linkedin, value: p.linkedin });
  if (p.github) items.push({ icon: Github, value: p.github });
  if (p.website) items.push({ icon: Globe, value: p.website });
  return items;
}

export function eduPeriod(start: string, end: string): string {
  const s = start.trim();
  const e = end.trim();
  if (s && e) return `${s} – ${e}`;
  return s || e || "";
}

export { EDUCATION_STATUS_LABEL, LANGUAGE_LEVEL_LABEL, periodLabel };

// Barra de nível (1–5) para habilidades — usada no modelo Moderno/Compacto.
export function LevelDots({ level, color, muted = "#e2e8f0" }: { level: number; color: string; muted?: string }) {
  return (
    <span className="cv-dots" style={{ display: "inline-flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: n <= level ? color : muted,
            display: "inline-block",
          }}
        />
      ))}
    </span>
  );
}

export function LevelBar({ level, color, track = "#e5e7eb" }: { level: number; color: string; track?: string }) {
  return (
    <span style={{ display: "block", height: 5, borderRadius: 999, background: track, overflow: "hidden" }}>
      <span style={{ display: "block", height: "100%", width: `${(level / 5) * 100}%`, background: color, borderRadius: 999 }} />
    </span>
  );
}

// True se nenhuma seção tem conteúdo (para o empty state do preview).
export function isResumeEmpty(resume: Resume): boolean {
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
