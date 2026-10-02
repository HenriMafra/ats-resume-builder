import type { TemplateProps } from "./shared";
import { LevelBar, EDUCATION_STATUS_LABEL, LANGUAGE_LEVEL_LABEL, periodLabel, eduPeriod } from "./shared";

// Compacto: cabeçalho no topo + duas colunas densas de conteúdo. Pensado para
// caber bastante informação em uma única folha.
export function TemplateCompacto({ resume, accent }: TemplateProps) {
  const p = resume.personal;
  const contacts = [p.email, p.phone, p.city, p.linkedin, p.github, p.website].filter(Boolean);
  const techSkills = resume.skills.filter((s) => s.kind === "tecnica");
  const softSkills = resume.skills.filter((s) => s.kind === "comportamental");

  return (
    <div style={{ padding: "24px 28px", color: "#1f2937" }}>
      {/* Cabeçalho */}
      <header style={{ borderBottom: `3px solid ${accent}`, paddingBottom: 10, marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: "1.55em", fontWeight: 800, margin: 0, color: "#111827", lineHeight: 1.1 }}>{p.name || "Seu Nome"}</h1>
            {p.title && <p style={{ fontSize: "0.92em", margin: "2px 0 0", color: accent, fontWeight: 600 }}>{p.title}</p>}
          </div>
        </div>
        {contacts.length > 0 && (
          <p style={{ fontSize: "0.74em", margin: "7px 0 0", color: "#4b5563", lineHeight: 1.5 }}>{contacts.join("  ·  ")}</p>
        )}
      </header>

      {resume.summary.trim() && (
        <div style={{ marginBottom: 12 }}>
          <SectionTitle accent={accent}>Resumo</SectionTitle>
          <p style={{ fontSize: "0.82em", lineHeight: 1.5, margin: 0, color: "#374151" }}>{resume.summary}</p>
        </div>
      )}

      {/* Duas colunas de conteúdo */}
      <div style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
        {/* Coluna esquerda (principal) */}
        <div style={{ flex: "1.35", minWidth: 0 }}>
          {resume.experiences.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <SectionTitle accent={accent}>Experiência</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {resume.experiences.map((exp) => (
                  <div key={exp.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 6 }}>
                      <span style={{ fontSize: "0.86em", fontWeight: 700, color: "#111827" }}>{exp.role || "Cargo"}</span>
                      <span style={{ fontSize: "0.7em", color: "#6b7280", whiteSpace: "nowrap" }}>{periodLabel(exp.start, exp.end, exp.current)}</span>
                    </div>
                    <p style={{ fontSize: "0.76em", color: accent, fontWeight: 600, margin: "0" }}>
                      {exp.company}
                      {exp.location ? <span style={{ color: "#9ca3af", fontWeight: 400 }}> · {exp.location}</span> : null}
                    </p>
                    {exp.bullets.filter((b) => b.trim()).length > 0 && (
                      <ul style={{ margin: "4px 0 0", paddingLeft: 14, display: "flex", flexDirection: "column", gap: 2 }}>
                        {exp.bullets.filter((b) => b.trim()).map((b, i) => (
                          <li key={i} style={{ fontSize: "0.78em", lineHeight: 1.4, color: "#374151" }}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.projects.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <SectionTitle accent={accent}>Projetos</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {resume.projects.map((proj) => (
                  <div key={proj.id}>
                    <span style={{ fontSize: "0.82em", fontWeight: 700, color: "#111827" }}>{proj.name || "Projeto"}</span>
                    {proj.link && <span style={{ fontSize: "0.7em", color: accent }}> · {proj.link}</span>}
                    {proj.description && <p style={{ fontSize: "0.77em", margin: "1px 0 0", lineHeight: 1.4, color: "#374151" }}>{proj.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Coluna direita (lateral) */}
        <div style={{ flex: "1", minWidth: 0 }}>
          {techSkills.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <SectionTitle accent={accent}>Habilidades</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {techSkills.map((s) => (
                  <div key={s.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76em", marginBottom: 2, color: "#374151" }}>
                      <span>{s.name}</span>
                    </div>
                    <LevelBar level={s.level} color={accent} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {softSkills.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <SectionTitle accent={accent}>Competências</SectionTitle>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {softSkills.map((s) => (
                  <span key={s.id} style={{ fontSize: "0.7em", background: `${accent}15`, color: "#374151", padding: "2px 6px", borderRadius: 4 }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {resume.education.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <SectionTitle accent={accent}>Formação</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {resume.education.map((edu) => (
                  <div key={edu.id}>
                    <p style={{ fontSize: "0.79em", fontWeight: 700, margin: 0, color: "#111827", lineHeight: 1.3 }}>{edu.course || "Curso"}</p>
                    <p style={{ fontSize: "0.74em", margin: "1px 0 0", color: "#4b5563" }}>{edu.institution}</p>
                    <p style={{ fontSize: "0.7em", margin: "1px 0 0", color: "#9ca3af" }}>
                      {eduPeriod(edu.start, edu.end)}
                      {eduPeriod(edu.start, edu.end) ? " · " : ""}
                      {EDUCATION_STATUS_LABEL[edu.status]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.languages.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <SectionTitle accent={accent}>Idiomas</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {resume.languages.map((l) => (
                  <div key={l.id} style={{ fontSize: "0.76em", display: "flex", justifyContent: "space-between", color: "#374151" }}>
                    <span>{l.name}</span>
                    <span style={{ color: "#6b7280" }}>{LANGUAGE_LEVEL_LABEL[l.level]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.certifications.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <SectionTitle accent={accent}>Certificações</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {resume.certifications.map((c) => (
                  <div key={c.id} style={{ fontSize: "0.74em", color: "#374151", lineHeight: 1.35 }}>
                    <strong style={{ color: "#111827" }}>{c.name}</strong>
                    {c.issuer ? ` · ${c.issuer}` : ""}
                    {c.year ? ` (${c.year})` : ""}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: "0.74em",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: accent,
        margin: "0 0 6px",
        paddingBottom: 3,
        borderBottom: `1.5px solid ${accent}40`,
      }}
    >
      {children}
    </h2>
  );
}
