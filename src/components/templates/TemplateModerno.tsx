import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import type { TemplateProps } from "./shared";
import { LevelDots, EDUCATION_STATUS_LABEL, LANGUAGE_LEVEL_LABEL, periodLabel, eduPeriod } from "./shared";

const ICONS = { Mail, Phone, MapPin, Linkedin, Github, Globe };

export function TemplateModerno({ resume, accent }: TemplateProps) {
  const p = resume.personal;
  const techSkills = resume.skills.filter((s) => s.kind === "tecnica");
  const softSkills = resume.skills.filter((s) => s.kind === "comportamental");

  return (
    <div style={{ display: "flex", minHeight: "100%", color: "#1f2937" }}>
      {/* ── Coluna lateral colorida ─────────────────────────────────────── */}
      <aside
        style={{
          width: "34%",
          background: accent,
          color: "#fff",
          padding: "28px 20px",
          minHeight: "100%",
        }}
      >
        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontSize: "1.55em", fontWeight: 800, lineHeight: 1.15, margin: 0 }}>{p.name || "Seu Nome"}</h1>
          {p.title && <p style={{ marginTop: 4, fontSize: "0.92em", opacity: 0.92, fontWeight: 500 }}>{p.title}</p>}
        </div>

        {/* Contatos */}
        <Section title="Contato" light>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {([
              ["Mail", p.email],
              ["Phone", p.phone],
              ["MapPin", p.city],
              ["Linkedin", p.linkedin],
              ["Github", p.github],
              ["Globe", p.website],
            ] as const)
              .filter(([, v]) => v)
              .map(([icon, v]) => {
                const Icon = ICONS[icon];
                return (
                  <div key={icon} style={{ display: "flex", gap: 7, alignItems: "flex-start", fontSize: "0.78em", opacity: 0.95 }}>
                    <Icon size={12} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ wordBreak: "break-word" }}>{v}</span>
                  </div>
                );
              })}
          </div>
        </Section>

        {/* Habilidades técnicas */}
        {techSkills.length > 0 && (
          <Section title="Habilidades" light>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {techSkills.map((s) => (
                <div key={s.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8em", marginBottom: 3 }}>
                    <span>{s.name}</span>
                  </div>
                  <LevelDots level={s.level} color="#fff" muted="rgba(255,255,255,0.3)" />
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Comportamentais */}
        {softSkills.length > 0 && (
          <Section title="Competências" light>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {softSkills.map((s) => (
                <span
                  key={s.id}
                  style={{
                    fontSize: "0.72em",
                    background: "rgba(255,255,255,0.18)",
                    padding: "2px 7px",
                    borderRadius: 999,
                  }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Idiomas */}
        {resume.languages.length > 0 && (
          <Section title="Idiomas" light>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {resume.languages.map((l) => (
                <div key={l.id} style={{ fontSize: "0.8em", display: "flex", justifyContent: "space-between" }}>
                  <span>{l.name}</span>
                  <span style={{ opacity: 0.85 }}>{LANGUAGE_LEVEL_LABEL[l.level]}</span>
                </div>
              ))}
            </div>
          </Section>
        )}
      </aside>

      {/* ── Coluna principal ────────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "28px 26px", minWidth: 0 }}>
        {resume.summary.trim() && (
          <MainSection title="Resumo" accent={accent}>
            <p style={{ fontSize: "0.9em", lineHeight: 1.55, color: "#374151", margin: 0 }}>{resume.summary}</p>
          </MainSection>
        )}

        {resume.experiences.length > 0 && (
          <MainSection title="Experiência" accent={accent}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {resume.experiences.map((exp) => (
                <div key={exp.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                    <h3 style={{ fontSize: "0.95em", fontWeight: 700, margin: 0, color: "#111827" }}>
                      {exp.role || "Cargo"}
                    </h3>
                    <span style={{ fontSize: "0.76em", color: "#6b7280", whiteSpace: "nowrap" }}>
                      {periodLabel(exp.start, exp.end, exp.current)}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.84em", color: accent, fontWeight: 600, margin: "1px 0 0" }}>
                    {exp.company}
                    {exp.location ? <span style={{ color: "#9ca3af", fontWeight: 400 }}> · {exp.location}</span> : null}
                  </p>
                  {exp.bullets.filter((b) => b.trim()).length > 0 && (
                    <ul style={{ margin: "6px 0 0", paddingLeft: 16, display: "flex", flexDirection: "column", gap: 3 }}>
                      {exp.bullets.filter((b) => b.trim()).map((b, i) => (
                        <li key={i} style={{ fontSize: "0.85em", lineHeight: 1.45, color: "#374151" }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {resume.projects.length > 0 && (
          <MainSection title="Projetos" accent={accent}>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {resume.projects.map((proj) => (
                <div key={proj.id}>
                  <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: "0.9em", fontWeight: 700, margin: 0, color: "#111827" }}>{proj.name || "Projeto"}</h3>
                    {proj.link && <span style={{ fontSize: "0.75em", color: accent }}>{proj.link}</span>}
                  </div>
                  {proj.description && (
                    <p style={{ fontSize: "0.84em", lineHeight: 1.45, color: "#374151", margin: "2px 0 0" }}>{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {resume.education.length > 0 && (
          <MainSection title="Formação" accent={accent}>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {resume.education.map((edu) => (
                <div key={edu.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                    <h3 style={{ fontSize: "0.9em", fontWeight: 700, margin: 0, color: "#111827" }}>{edu.course || "Curso"}</h3>
                    <span style={{ fontSize: "0.76em", color: "#6b7280", whiteSpace: "nowrap" }}>{eduPeriod(edu.start, edu.end)}</span>
                  </div>
                  <p style={{ fontSize: "0.83em", color: "#4b5563", margin: "1px 0 0" }}>
                    {edu.institution}
                    <span style={{ color: "#9ca3af" }}> · {EDUCATION_STATUS_LABEL[edu.status]}</span>
                  </p>
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {resume.certifications.length > 0 && (
          <MainSection title="Certificações" accent={accent}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {resume.certifications.map((c) => (
                <div key={c.id} style={{ fontSize: "0.84em", color: "#374151" }}>
                  <strong style={{ color: "#111827" }}>{c.name}</strong>
                  {c.issuer ? ` — ${c.issuer}` : ""}
                  {c.year ? ` (${c.year})` : ""}
                </div>
              ))}
            </div>
          </MainSection>
        )}
      </main>
    </div>
  );
}

function Section({ title, children, light }: { title: string; children: React.ReactNode; light?: boolean }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2
        style={{
          fontSize: "0.74em",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          margin: "0 0 8px",
          paddingBottom: 4,
          borderBottom: light ? "1px solid rgba(255,255,255,0.3)" : "1px solid #e5e7eb",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function MainSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 18 }}>
      <h2
        style={{
          fontSize: "0.82em",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: accent,
          margin: "0 0 9px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {title}
        <span style={{ flex: 1, height: 2, background: `${accent}33`, borderRadius: 2 }} />
      </h2>
      {children}
    </section>
  );
}
