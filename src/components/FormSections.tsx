import { AnimatePresence, motion } from "framer-motion";
import { Plus, GripVertical, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { useResume } from "../lib/store";
import { Field, TextArea, Select, IconButton, ItemCard } from "./ui";
import {
  newExperience,
  newEducation,
  newSkill,
  newLanguage,
  newCertification,
  newProject,
} from "../data/empty";
import {
  EDUCATION_STATUS_LABEL,
  LANGUAGE_LEVEL_LABEL,
  LANGUAGE_LEVELS,
} from "../lib/format";
import { isValidEmail } from "../lib/engine";
import { SUMMARY_MIN, SUMMARY_MAX } from "../lib/engine";
import type { EducationStatus, LanguageLevel, SkillKind } from "../types";

// Botão "adicionar item" padrão das seções.
function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 py-2.5 text-sm font-semibold text-slate-400 transition hover:border-brand-400/50 hover:text-brand-200"
    >
      <Plus size={15} /> {label}
    </button>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return <p className="px-1 pb-1 text-xs text-slate-500">{children}</p>;
}

// ── Dados pessoais ─────────────────────────────────────────────────────────
export function PersonalSection() {
  const personal = useResume((s) => s.resume.personal);
  const update = useResume((s) => s.updatePersonal);
  const emailInvalid = personal.email.trim().length > 0 && !isValidEmail(personal.email);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="Nome completo" value={personal.name} onChange={(v) => update({ name: v })} placeholder="Ex.: Mariana Albuquerque" />
      </div>
      <div className="sm:col-span-2">
        <Field label="Título profissional" value={personal.title} onChange={(v) => update({ title: v })} placeholder="Ex.: Engenheira de Software Sênior" />
      </div>
      <Field
        label="E-mail"
        type="email"
        value={personal.email}
        onChange={(v) => update({ email: v })}
        placeholder="voce@email.com"
        invalid={emailInvalid}
        hint="Informe um e-mail válido."
      />
      <Field label="Telefone" value={personal.phone} onChange={(v) => update({ phone: v })} placeholder="(11) 90000-0000" />
      <Field label="Cidade / UF" value={personal.city} onChange={(v) => update({ city: v })} placeholder="São Paulo, SP" />
      <Field label="LinkedIn" value={personal.linkedin} onChange={(v) => update({ linkedin: v })} placeholder="linkedin.com/in/voce" />
      <Field label="GitHub" value={personal.github} onChange={(v) => update({ github: v })} placeholder="github.com/voce" />
      <Field label="Site / Portfólio" value={personal.website} onChange={(v) => update({ website: v })} placeholder="seusite.dev" />
    </div>
  );
}

// ── Resumo ─────────────────────────────────────────────────────────────────
export function SummarySection() {
  const summary = useResume((s) => s.resume.summary);
  const update = useResume((s) => s.updateSummary);
  const len = summary.trim().length;
  const ok = len >= SUMMARY_MIN && len <= SUMMARY_MAX;
  const color = ok ? "text-emerald-300" : len === 0 ? "text-slate-500" : "text-amber-300";

  return (
    <div>
      <TextArea
        value={summary}
        onChange={update}
        rows={5}
        placeholder="Resuma sua experiência, especialidades e o valor que você entrega. Ideal entre 200 e 600 caracteres."
      />
      <div className="mt-1.5 flex items-center justify-between text-[11px]">
        <span className="text-slate-500">Recomendado: {SUMMARY_MIN}–{SUMMARY_MAX} caracteres</span>
        <span className={`font-semibold ${color}`}>{len} caracteres</span>
      </div>
    </div>
  );
}

// ── Experiências ───────────────────────────────────────────────────────────
export function ExperienceSection() {
  const experiences = useResume((s) => s.resume.experiences);
  const add = useResume((s) => s.addExperience);
  const update = useResume((s) => s.updateExperience);
  const remove = useResume((s) => s.removeExperience);
  const move = useResume((s) => s.moveExperience);
  const addBullet = useResume((s) => s.addBullet);
  const updateBullet = useResume((s) => s.updateBullet);
  const removeBullet = useResume((s) => s.removeBullet);
  const moveBullet = useResume((s) => s.moveBullet);

  return (
    <div className="space-y-3">
      {experiences.length === 0 && (
        <EmptyHint>Nenhuma experiência ainda. Adicione cargos, empresas e suas realizações.</EmptyHint>
      )}
      <AnimatePresence initial={false}>
        {experiences.map((exp, i) => (
          <motion.div key={exp.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <ItemCard
              title={exp.role || exp.company || `Experiência ${i + 1}`}
              index={i}
              count={experiences.length}
              onUp={() => move(exp.id, -1)}
              onDown={() => move(exp.id, 1)}
              onRemove={() => remove(exp.id)}
            >
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <Field label="Cargo" value={exp.role} onChange={(v) => update(exp.id, { role: v })} placeholder="Ex.: Desenvolvedora Full Stack" />
                <Field label="Empresa" value={exp.company} onChange={(v) => update(exp.id, { company: v })} placeholder="Ex.: Nuvem Pagamentos" />
                <Field label="Início" value={exp.start} onChange={(v) => update(exp.id, { start: v })} placeholder="Mar 2021" />
                <Field
                  label="Fim"
                  value={exp.current ? "" : exp.end}
                  onChange={(v) => update(exp.id, { end: v })}
                  placeholder={exp.current ? "atual" : "Dez 2023"}
                />
                <div className="sm:col-span-2">
                  <Field label="Local" value={exp.location} onChange={(v) => update(exp.id, { location: v })} placeholder="São Paulo, SP (híbrido)" />
                </div>
              </div>

              <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => update(exp.id, { current: e.target.checked })}
                  className="h-4 w-4 rounded border-white/20 bg-ink-900 accent-brand-500"
                />
                Trabalho aqui atualmente (mostra "atual")
              </label>

              {/* Bullets de realizações */}
              <div>
                <p className="label mb-1.5">Realizações</p>
                <div className="space-y-1.5">
                  {exp.bullets.map((b, bi) => (
                    <div key={bi} className="flex items-start gap-1.5">
                      <GripVertical size={14} className="mt-2.5 shrink-0 text-slate-600" />
                      <textarea
                        value={b}
                        rows={1}
                        onChange={(e) => updateBullet(exp.id, bi, e.target.value)}
                        placeholder="Ex.: Reduzi o tempo de build em 35% otimizando o pipeline."
                        className="field min-h-[38px] resize-y py-2 text-[13px] leading-snug"
                      />
                      <div className="mt-1 flex flex-col gap-1">
                        <div className="flex gap-1">
                          <IconButton onClick={() => moveBullet(exp.id, bi, -1)} disabled={bi === 0} title="Subir realização">
                            <ArrowUp size={13} />
                          </IconButton>
                          <IconButton onClick={() => moveBullet(exp.id, bi, 1)} disabled={bi === exp.bullets.length - 1} title="Descer realização">
                            <ArrowDown size={13} />
                          </IconButton>
                          <IconButton onClick={() => removeBullet(exp.id, bi)} title="Remover realização" danger>
                            <Trash2 size={13} />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addBullet(exp.id)}
                  className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-300 hover:text-brand-200"
                >
                  <Plus size={13} /> Adicionar realização
                </button>
              </div>
            </ItemCard>
          </motion.div>
        ))}
      </AnimatePresence>
      <AddButton label="Adicionar experiência" onClick={() => add(newExperience())} />
    </div>
  );
}

// ── Formação ───────────────────────────────────────────────────────────────
export function EducationSection() {
  const education = useResume((s) => s.resume.education);
  const add = useResume((s) => s.addEducation);
  const update = useResume((s) => s.updateEducation);
  const remove = useResume((s) => s.removeEducation);
  const move = useResume((s) => s.moveEducation);

  const statusOptions = (Object.keys(EDUCATION_STATUS_LABEL) as EducationStatus[]).map((k) => ({
    value: k,
    label: EDUCATION_STATUS_LABEL[k],
  }));

  return (
    <div className="space-y-3">
      {education.length === 0 && <EmptyHint>Adicione cursos, faculdades e o status de cada formação.</EmptyHint>}
      <AnimatePresence initial={false}>
        {education.map((edu, i) => (
          <motion.div key={edu.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <ItemCard
              title={edu.course || edu.institution || `Formação ${i + 1}`}
              index={i}
              count={education.length}
              onUp={() => move(edu.id, -1)}
              onDown={() => move(edu.id, 1)}
              onRemove={() => remove(edu.id)}
            >
              <Field label="Curso" value={edu.course} onChange={(v) => update(edu.id, { course: v })} placeholder="Ex.: Bacharelado em Ciência da Computação" />
              <Field label="Instituição" value={edu.institution} onChange={(v) => update(edu.id, { institution: v })} placeholder="Ex.: Universidade de São Paulo (USP)" />
              <div className="grid grid-cols-2 gap-2.5">
                <Field label="Início" value={edu.start} onChange={(v) => update(edu.id, { start: v })} placeholder="2012" />
                <Field label="Fim" value={edu.end} onChange={(v) => update(edu.id, { end: v })} placeholder="2015" />
              </div>
              <Select label="Status" value={edu.status} onChange={(v) => update(edu.id, { status: v })} options={statusOptions} />
            </ItemCard>
          </motion.div>
        ))}
      </AnimatePresence>
      <AddButton label="Adicionar formação" onClick={() => add(newEducation())} />
    </div>
  );
}

// ── Habilidades ────────────────────────────────────────────────────────────
export function SkillsSection() {
  const skills = useResume((s) => s.resume.skills);
  const add = useResume((s) => s.addSkill);
  const update = useResume((s) => s.updateSkill);
  const remove = useResume((s) => s.removeSkill);
  const move = useResume((s) => s.moveSkill);

  const kindOptions: { value: SkillKind; label: string }[] = [
    { value: "tecnica", label: "Técnica" },
    { value: "comportamental", label: "Comportamental" },
  ];

  return (
    <div className="space-y-2">
      {skills.length === 0 && <EmptyHint>Liste pelo menos 5 habilidades (técnicas e comportamentais) com nível de 1 a 5.</EmptyHint>}
      <AnimatePresence initial={false}>
        {skills.map((sk, i) => (
          <motion.div
            key={sk.id}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-xl border border-white/10 bg-ink-900/50 p-2.5"
          >
            <div className="flex items-center gap-2">
              <input
                value={sk.name}
                onChange={(e) => update(sk.id, { name: e.target.value })}
                placeholder="Ex.: React"
                aria-label="Nome da habilidade"
                className="field flex-1 py-1.5"
              />
              <select
                value={sk.kind}
                onChange={(e) => update(sk.id, { kind: e.target.value as SkillKind })}
                aria-label="Tipo de habilidade"
                className="field w-auto cursor-pointer py-1.5 text-xs"
              >
                {kindOptions.map((o) => (
                  <option key={o.value} value={o.value} className="bg-ink-850">
                    {o.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-0.5">
                <IconButton onClick={() => move(sk.id, -1)} disabled={i === 0} title="Subir">
                  <ArrowUp size={13} />
                </IconButton>
                <IconButton onClick={() => move(sk.id, 1)} disabled={i === skills.length - 1} title="Descer">
                  <ArrowDown size={13} />
                </IconButton>
                <IconButton onClick={() => remove(sk.id)} title="Remover" danger>
                  <Trash2 size={13} />
                </IconButton>
              </div>
            </div>
            {/* Seletor de nível 1–5 */}
            <div className="mt-2 flex items-center gap-1.5">
              <span className="label">Nível</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => update(sk.id, { level: n })}
                    aria-label={`Nível ${n}`}
                    title={`Nível ${n} de 5`}
                    className={`h-3.5 w-6 rounded-full transition ${
                      n <= sk.level ? "bg-brand-500" : "bg-white/10 hover:bg-white/20"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-1 text-[11px] font-semibold text-slate-400">{sk.level}/5</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <AddButton label="Adicionar habilidade" onClick={() => add(newSkill())} />
    </div>
  );
}

// ── Idiomas ────────────────────────────────────────────────────────────────
export function LanguagesSection() {
  const languages = useResume((s) => s.resume.languages);
  const add = useResume((s) => s.addLanguage);
  const update = useResume((s) => s.updateLanguage);
  const remove = useResume((s) => s.removeLanguage);

  const levelOptions = LANGUAGE_LEVELS.map((l) => ({ value: l, label: LANGUAGE_LEVEL_LABEL[l] }));

  return (
    <div className="space-y-2">
      {languages.length === 0 && <EmptyHint>Adicione idiomas e o nível (básico → nativo).</EmptyHint>}
      <AnimatePresence initial={false}>
        {languages.map((lang) => (
          <motion.div
            key={lang.id}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2"
          >
            <input
              value={lang.name}
              onChange={(e) => update(lang.id, { name: e.target.value })}
              placeholder="Ex.: Inglês"
              aria-label="Idioma"
              className="field flex-1 py-1.5"
            />
            <select
              value={lang.level}
              onChange={(e) => update(lang.id, { level: e.target.value as LanguageLevel })}
              aria-label="Nível do idioma"
              className="field w-auto cursor-pointer py-1.5 text-xs"
            >
              {levelOptions.map((o) => (
                <option key={o.value} value={o.value} className="bg-ink-850">
                  {o.label}
                </option>
              ))}
            </select>
            <IconButton onClick={() => remove(lang.id)} title="Remover idioma" danger>
              <Trash2 size={13} />
            </IconButton>
          </motion.div>
        ))}
      </AnimatePresence>
      <AddButton label="Adicionar idioma" onClick={() => add(newLanguage())} />
    </div>
  );
}

// ── Certificações ──────────────────────────────────────────────────────────
export function CertificationsSection() {
  const certifications = useResume((s) => s.resume.certifications);
  const add = useResume((s) => s.addCertification);
  const update = useResume((s) => s.updateCertification);
  const remove = useResume((s) => s.removeCertification);
  const move = useResume((s) => s.moveCertification);

  return (
    <div className="space-y-3">
      {certifications.length === 0 && <EmptyHint>Adicione certificações, emissores e anos.</EmptyHint>}
      <AnimatePresence initial={false}>
        {certifications.map((cert, i) => (
          <motion.div key={cert.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            <ItemCard
              title={cert.name || `Certificação ${i + 1}`}
              index={i}
              count={certifications.length}
              onUp={() => move(cert.id, -1)}
              onDown={() => move(cert.id, 1)}
              onRemove={() => remove(cert.id)}
            >
              <Field label="Nome" value={cert.name} onChange={(v) => update(cert.id, { name: v })} placeholder="Ex.: AWS Solutions Architect" />
              <div className="grid grid-cols-[1fr,90px] gap-2.5">
                <Field label="Emissor" value={cert.issuer} onChange={(v) => update(cert.id, { issuer: v })} placeholder="Ex.: Amazon Web Services" />
                <Field label="Ano" value={cert.year} onChange={(v) => update(cert.id, { year: v })} placeholder="2022" />
              </div>
            </ItemCard>
          </motion.div>
        ))}
      </AnimatePresence>
      <AddButton label="Adicionar certificação" onClick={() => add(newCertification())} />
    </div>
  );
}

// ── Projetos ───────────────────────────────────────────────────────────────
export function ProjectsSection() {
  const projects = useResume((s) => s.resume.projects);
  const add = useResume((s) => s.addProject);
  const update = useResume((s) => s.updateProject);
  const remove = useResume((s) => s.removeProject);
  const move = useResume((s) => s.moveProject);

  return (
    <div className="space-y-3">
      {projects.length === 0 && <EmptyHint>Mostre projetos relevantes com descrição e link.</EmptyHint>}
      <AnimatePresence initial={false}>
        {projects.map((proj, i) => (
          <motion.div key={proj.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            <ItemCard
              title={proj.name || `Projeto ${i + 1}`}
              index={i}
              count={projects.length}
              onUp={() => move(proj.id, -1)}
              onDown={() => move(proj.id, 1)}
              onRemove={() => remove(proj.id)}
            >
              <Field label="Nome" value={proj.name} onChange={(v) => update(proj.id, { name: v })} placeholder="Ex.: OpenForms" />
              <TextArea label="Descrição" value={proj.description} onChange={(v) => update(proj.id, { description: v })} rows={2} placeholder="O que é, tecnologias e impacto." />
              <Field label="Link" value={proj.link} onChange={(v) => update(proj.id, { link: v })} placeholder="github.com/voce/projeto" />
            </ItemCard>
          </motion.div>
        ))}
      </AnimatePresence>
      <AddButton label="Adicionar projeto" onClick={() => add(newProject())} />
    </div>
  );
}
