import type {
  Certification,
  Education,
  Experience,
  Language,
  Project,
  Resume,
  Skill,
} from "../types";
import { uid } from "../lib/format";

// Currículo em branco (estado inicial).
export function emptyResume(): Resume {
  return {
    personal: {
      name: "",
      title: "",
      email: "",
      phone: "",
      city: "",
      linkedin: "",
      github: "",
      website: "",
    },
    summary: "",
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    projects: [],
  };
}

// Fábricas de novos itens (já com id) para os formulários CRUD.
export function newExperience(): Experience {
  return {
    id: uid("exp"),
    role: "",
    company: "",
    start: "",
    end: "",
    current: false,
    location: "",
    bullets: [""],
  };
}

export function newEducation(): Education {
  return {
    id: uid("edu"),
    course: "",
    institution: "",
    start: "",
    end: "",
    status: "concluido",
  };
}

export function newSkill(): Skill {
  return { id: uid("sk"), name: "", level: 3, kind: "tecnica" };
}

export function newLanguage(): Language {
  return { id: uid("lang"), name: "", level: "intermediario" };
}

export function newCertification(): Certification {
  return { id: uid("cert"), name: "", issuer: "", year: "" };
}

export function newProject(): Project {
  return { id: uid("proj"), name: "", description: "", link: "" };
}
