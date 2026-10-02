import type { TemplateProps } from "./shared";
import { EDUCATION_STATUS_LABEL, LANGUAGE_LEVEL_LABEL, periodLabel, eduPeriod } from "./shared";

// Clássico ATS: uma coluna sóbria, fonte serifada, sem cores de fundo nem
// ornamentos. Acento aparece apenas, discretamente, em links — para máxima
// legibilidade por sistemas de triagem (ATS).
export function TemplateClassico({ resume, accent }: TemplateProps) {
  const p = resume.personal;
  const contacts = [p.email, p.phone, p.city, p.linkedin, p.github, p.website].filter(Boolean);

  return (
    <div style={{ padding: "34px 40px", color: "#1a1a1a", fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}>
      {/* Cabeçalho centralizado */}
      <header style={{ textAlign: "center", borderBottom: "2px solid #1a1a1a", paddingBottom: 12, marginBottom: 16 }}>
        <h1 style={{ fontSize: "1.7em", fontWeight: 700, margin: 0, letterSpacing: "0.02em" }}>{p.name || "Seu Nome"}</h1>
        {p.title && <p style={{ fontSize: "1em", margin: "3px 0 0", color: "#333" }}>{p.title}</p>}
        {contacts.length > 0 && (
          <p style={{ fontSize: "0.8em", margin: "8px 0 0", color: "#444", lineHeight: 1.5 }}>
            {contacts.join("  •  ")}
          </p>
        )}
      </header>

      {resume.summary.trim() && (
        <Section title="Resumo profissional">
          <p style={{ fontSize: "0.9em", lineHeight: 1.55, margin: 0, textAlign: "justify" }}>{resume.summary}</p>
        </Section>
      )}

      {resume.experiences.length > 0 && (
        <Section title="Experiência profissional">
          {resume.experiences.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 11 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: "0.95em", fontWeight: 700 }}>
                  {exp.role || "Cargo"}
                  {exp.company ? `, ${exp.company}` : ""}
                </span>
                <span style={{ fontSize: "0.82em", fontStyle: "italic", color: "#444", whiteSpace: "nowrap" }}>
                  {periodLabel(exp.start, exp.end, exp.current)}
                </span>
              </div>
              {exp.location && <p style={{ fontSize: "0.82em", margin: "1px 0 0", color: "#555", fontStyle: "italic" }}>{exp.location}</p>}
              {exp.bullets.filter((b) => b.trim()).length > 0 && (
                <ul style={{ margin: "5px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 2 }}>
                  {exp.bullets.filter((b) => b.trim()).map((b, i) => (
                    <li key={i} style={{ fontSize: "0.88em", lineHeight: 1.45 }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {resume.education.length > 0 && (
        <Section title="Formação acadêmica">
          {resume.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: "0.9em", fontWeight: 700 }}>{edu.course || "Curso"}</span>
                <span style={{ fontSize: "0.82em", fontStyle: "italic", color: "#444", whiteSpace: "nowrap" }}>{eduPeriod(edu.start, edu.end)}</span>
              </div>
              <p style={{ fontSize: "0.86em", margin: "1px 0 0", color: "#333" }}>
                {edu.institution} — {EDUCATION_STATUS_LABEL[edu.status]}
              </p>
            </div>
          ))}
        </Section>
      )}

      {resume.skills.length > 0 && (
        <Section title="Habilidades">
          <p style={{ fontSize: "0.88em", lineHeight: 1.6, margin: 0 }}>
            {resume.skills.map((s) => s.name).filter(Boolean).join("  •  ")}
          </p>
        </Section>
      )}

      {resume.languages.length > 0 && (
        <Section title="Idiomas">
          <p style={{ fontSize: "0.88em", lineHeight: 1.6, margin: 0 }}>
            {resume.languages.map((l) => `${l.name} (${LANGUAGE_LEVEL_LABEL[l.level]})`).join("  •  ")}
          </p>
        </Section>
      )}

      {resume.certifications.length > 0 && (
        <Section title="Certificações">
          <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 2 }}>
            {resume.certifications.map((c) => (
              <li key={c.id} style={{ fontSize: "0.88em", lineHeight: 1.45 }}>
                {c.name}
                {c.issuer ? `, ${c.issuer}` : ""}
                {c.year ? ` (${c.year})` : ""}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {resume.projects.length > 0 && (
        <Section title="Projetos">
          {resume.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 6 }}>
              <span style={{ fontSize: "0.9em", fontWeight: 700 }}>{proj.name || "Projeto"}</span>
              {proj.link && <span style={{ fontSize: "0.82em", color: accent }}> — {proj.link}</span>}
              {proj.description && <p style={{ fontSize: "0.87em", margin: "1px 0 0", lineHeight: 1.45 }}>{proj.description}</p>}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 14 }}>
      <h2
        style={{
          fontSize: "0.82em",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          borderBottom: "1px solid #1a1a1a",
          paddingBottom: 3,
          margin: "0 0 7px",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
