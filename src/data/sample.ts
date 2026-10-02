import type { Resume } from "../types";

// Currículo de exemplo — pessoa desenvolvedora brasileira, completo e pensado
// para pontuar bem na Análise ATS (verbos de ação, números, >=5 habilidades,
// e-mail válido + LinkedIn, resumo entre 200 e 600 caracteres).
export const SAMPLE_RESUME: Resume = {
  personal: {
    name: "Mariana Albuquerque",
    title: "Engenheira de Software Sênior",
    email: "mariana.albuquerque@email.com",
    phone: "(11) 98765-4321",
    city: "São Paulo, SP",
    linkedin: "linkedin.com/in/mariana-albuquerque",
    github: "github.com/marianadev",
    website: "marianaalbuquerque.dev",
  },
  summary:
    "Engenheira de software com mais de 8 anos de experiência construindo produtos web em larga escala com React, Node.js e Go. Especialista em performance, arquitetura de microsserviços e cultura de qualidade. Já liderei equipes de até 6 pessoas e gosto de transformar problemas ambíguos em entregas mensuráveis para o negócio.",
  experiences: [
    {
      id: "exp-1",
      role: "Engenheira de Software Sênior",
      company: "Nuvem Pagamentos",
      start: "Mar 2021",
      end: "",
      current: true,
      location: "São Paulo, SP (híbrido)",
      bullets: [
        "Liderei a migração de um monólito PHP para microsserviços em Go, reduzindo o tempo de resposta da API em 42%.",
        "Implementei pipeline de testes automatizados que elevou a cobertura de 38% para 86% em 4 meses.",
        "Reduzi o custo de infraestrutura em R$ 380 mil por ano ao otimizar o uso de containers na AWS.",
        "Mentorei 5 pessoas desenvolvedoras juniores, com 3 promoções ao nível pleno em 12 meses.",
      ],
    },
    {
      id: "exp-2",
      role: "Desenvolvedora Full Stack Pleno",
      company: "Loja Express",
      start: "Jun 2018",
      end: "Fev 2021",
      current: false,
      location: "Campinas, SP",
      bullets: [
        "Desenvolvi o checkout em React que aumentou a taxa de conversão em 18%.",
        "Automatizei o processo de deploy, diminuindo o tempo de publicação de 40 para 6 minutos.",
        "Integrei 4 gateways de pagamento, ampliando as opções de cobrança para 12 milhões de clientes.",
      ],
    },
    {
      id: "exp-3",
      role: "Desenvolvedora Júnior",
      company: "Agência Pixel",
      start: "Jan 2016",
      end: "Mai 2018",
      current: false,
      location: "São Paulo, SP",
      bullets: [
        "Criei mais de 30 landing pages responsivas com foco em acessibilidade e SEO.",
        "Otimizei o tempo de carregamento dos sites em 35% aplicando lazy loading e cache.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      course: "Bacharelado em Ciência da Computação",
      institution: "Universidade de São Paulo (USP)",
      start: "2012",
      end: "2015",
      status: "concluido",
    },
    {
      id: "edu-2",
      course: "Pós-graduação em Arquitetura de Software",
      institution: "PUC-SP",
      start: "2019",
      end: "2020",
      status: "concluido",
    },
  ],
  skills: [
    { id: "sk-1", name: "React", level: 5, kind: "tecnica" },
    { id: "sk-2", name: "TypeScript", level: 5, kind: "tecnica" },
    { id: "sk-3", name: "Node.js", level: 4, kind: "tecnica" },
    { id: "sk-4", name: "Go", level: 4, kind: "tecnica" },
    { id: "sk-5", name: "PostgreSQL", level: 4, kind: "tecnica" },
    { id: "sk-6", name: "AWS", level: 4, kind: "tecnica" },
    { id: "sk-7", name: "Docker & Kubernetes", level: 3, kind: "tecnica" },
    { id: "sk-8", name: "Liderança de equipe", level: 5, kind: "comportamental" },
    { id: "sk-9", name: "Comunicação", level: 5, kind: "comportamental" },
    { id: "sk-10", name: "Resolução de problemas", level: 5, kind: "comportamental" },
  ],
  languages: [
    { id: "lang-1", name: "Português", level: "nativo" },
    { id: "lang-2", name: "Inglês", level: "fluente" },
    { id: "lang-3", name: "Espanhol", level: "intermediario" },
  ],
  certifications: [
    { id: "cert-1", name: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", year: "2022" },
    { id: "cert-2", name: "Professional Scrum Master I (PSM I)", issuer: "Scrum.org", year: "2020" },
  ],
  projects: [
    {
      id: "proj-1",
      name: "OpenForms",
      description: "Biblioteca open source de formulários acessíveis em React, com mais de 1.200 estrelas no GitHub.",
      link: "github.com/marianadev/openforms",
    },
    {
      id: "proj-2",
      name: "DevMetrics",
      description: "Dashboard de métricas DORA para times de engenharia, usado por 3 startups.",
      link: "devmetrics.app",
    },
  ],
};
