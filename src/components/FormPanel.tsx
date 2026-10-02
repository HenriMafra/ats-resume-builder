import { useState } from "react";
import { User, FileText, Briefcase, GraduationCap, Wrench, Languages, Award, FolderGit2 } from "lucide-react";
import { AccordionSection } from "./Accordion";
import { useResume } from "../lib/store";
import {
  PersonalSection,
  SummarySection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  LanguagesSection,
  CertificationsSection,
  ProjectsSection,
} from "./FormSections";

type SectionId =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "languages"
  | "certifications"
  | "projects";

export function FormPanel() {
  const resume = useResume((s) => s.resume);
  // Dados pessoais aberto por padrão.
  const [open, setOpen] = useState<Record<SectionId, boolean>>({
    personal: true,
    summary: false,
    experience: false,
    education: false,
    skills: false,
    languages: false,
    certifications: false,
    projects: false,
  });

  const toggle = (id: string) => setOpen((o) => ({ ...o, [id]: !o[id as SectionId] }));

  return (
    <div className="space-y-3">
      <AccordionSection id="personal" title="Dados pessoais" icon={User} open={open.personal} onToggle={toggle}>
        <PersonalSection />
      </AccordionSection>

      <AccordionSection id="summary" title="Resumo" icon={FileText} open={open.summary} onToggle={toggle}>
        <SummarySection />
      </AccordionSection>

      <AccordionSection
        id="experience"
        title="Experiências"
        icon={Briefcase}
        count={resume.experiences.length}
        open={open.experience}
        onToggle={toggle}
      >
        <ExperienceSection />
      </AccordionSection>

      <AccordionSection
        id="education"
        title="Formação"
        icon={GraduationCap}
        count={resume.education.length}
        open={open.education}
        onToggle={toggle}
      >
        <EducationSection />
      </AccordionSection>

      <AccordionSection
        id="skills"
        title="Habilidades"
        icon={Wrench}
        count={resume.skills.length}
        open={open.skills}
        onToggle={toggle}
      >
        <SkillsSection />
      </AccordionSection>

      <AccordionSection
        id="languages"
        title="Idiomas"
        icon={Languages}
        count={resume.languages.length}
        open={open.languages}
        onToggle={toggle}
      >
        <LanguagesSection />
      </AccordionSection>

      <AccordionSection
        id="certifications"
        title="Certificações"
        icon={Award}
        count={resume.certifications.length}
        open={open.certifications}
        onToggle={toggle}
      >
        <CertificationsSection />
      </AccordionSection>

      <AccordionSection
        id="projects"
        title="Projetos"
        icon={FolderGit2}
        count={resume.projects.length}
        open={open.projects}
        onToggle={toggle}
      >
        <ProjectsSection />
      </AccordionSection>
    </div>
  );
}
