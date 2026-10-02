import { describe, it, expect } from "vitest";
import {
  scoreResume,
  startsWithActionVerb,
  hasNumber,
  isValidEmail,
  collectBullets,
} from "../engine";
import { emptyResume } from "../../data/empty";
import { SAMPLE_RESUME } from "../../data/sample";
import type { Resume } from "../../types";
import { ACTION_VERBS } from "../../data/verbs";
import { mergeResume, sanitizeSettings } from "../store";

// Helper: clona o currículo de exemplo para mutações isoladas por teste.
function cloneSample(): Resume {
  return JSON.parse(JSON.stringify(SAMPLE_RESUME)) as Resume;
}

describe("startsWithActionVerb (vetor 3)", () => {
  it("detecta verbo de ação no início do bullet", () => {
    expect(startsWithActionVerb("Desenvolvi um sistema de cobrança")).toBe(true);
    expect(startsWithActionVerb("Liderei a equipe de back-end")).toBe(true);
    expect(startsWithActionVerb("Reduzi o tempo de build em 35%")).toBe(true);
  });

  it("NÃO detecta quando o bullet começa com 'Responsável por'", () => {
    expect(startsWithActionVerb("Responsável por sistema")).toBe(false);
    expect(startsWithActionVerb("Atuação em projetos diversos")).toBe(false);
    expect(startsWithActionVerb("")).toBe(false);
  });

  it("é tolerante a acentos e caixa", () => {
    expect(startsWithActionVerb("CONSTRUÍ uma API REST")).toBe(true);
    expect(startsWithActionVerb("construi sem acento")).toBe(true);
  });
});

describe("hasNumber (vetor 4)", () => {
  it("conta bullet com número/percentual", () => {
    expect(hasNumber("Reduzi o tempo de build em 35%")).toBe(true);
    expect(hasNumber("Economizei R$ 380 mil por ano")).toBe(true);
  });
  it("não conta bullet sem dígitos", () => {
    expect(hasNumber("Melhorei a performance geral")).toBe(false);
  });
});

describe("isValidEmail (vetor 5)", () => {
  it("aceita e-mail válido e rejeita inválido", () => {
    expect(isValidEmail("mariana.albuquerque@email.com")).toBe(true);
    expect(isValidEmail("sem-arroba.com")).toBe(false);
    expect(isValidEmail("falta@dominio")).toBe(false);
  });
});

describe("scoreResume — vetores do spec", () => {
  it("vetor 1: currículo vazio pontua menos de 15", () => {
    const r = scoreResume(emptyResume());
    expect(r.score).toBeLessThan(15);
  });

  it("vetor 2: preencher todos os essenciais adiciona os 40 pts proporcionais", () => {
    const base = emptyResume();
    const before = scoreResume(base);

    const filled = emptyResume();
    filled.personal.name = "João Silva";
    filled.personal.title = "Desenvolvedor";
    filled.personal.email = "joao@email.com";
    filled.personal.phone = "(11) 99999-0000";
    filled.experiences = [
      {
        id: "e1",
        role: "Dev",
        company: "Empresa",
        start: "2020",
        end: "2022",
        current: false,
        location: "SP",
        bullets: [],
      },
    ];
    filled.education = [
      {
        id: "ed1",
        course: "ADS",
        institution: "Faculdade",
        start: "2018",
        end: "2020",
        status: "concluido",
      },
    ];

    const after = scoreResume(filled);
    const essentialsCheck = after.checks.find((c) => c.id === "essentials");
    expect(essentialsCheck?.status).toBe("ok");
    expect(essentialsCheck?.points).toBe(40);
    // O ganho frente ao vazio é de exatamente 40 pts (só os essenciais mudaram).
    expect(after.score - before.score).toBe(40);
  });

  it("vetor 3: bullet com verbo de ação conta; 'Responsável por' não", () => {
    const r = cloneSample();
    // Sobrescreve os bullets para um cenário controlado: 3 com verbo, 0 sem.
    r.experiences = [
      {
        id: "x",
        role: "Dev",
        company: "Co",
        start: "2020",
        end: "2021",
        current: false,
        location: "SP",
        bullets: [
          "Desenvolvi um sistema de cobrança",
          "Liderei a migração para a nuvem",
          "Implementei testes automatizados",
          "Responsável por sistema",
        ],
      },
    ];
    const bullets = collectBullets(r);
    const action = bullets.filter((b) => startsWithActionVerb(b));
    expect(action).toHaveLength(3);
    const res = scoreResume(r);
    expect(res.checks.find((c) => c.id === "action-verbs")?.status).toBe("ok");
  });

  it("vetor 4: 'Reduzi o tempo de build em 35%' conta como bullet com número", () => {
    const r = emptyResume();
    r.experiences = [
      {
        id: "x",
        role: "Dev",
        company: "Co",
        start: "2020",
        end: "2021",
        current: false,
        location: "SP",
        bullets: ["Reduzi o tempo de build em 35%", "Aumentei a cobertura para 90%"],
      },
    ];
    const numbered = collectBullets(r).filter((b) => hasNumber(b));
    expect(numbered).toHaveLength(2);
    expect(scoreResume(r).checks.find((c) => c.id === "numbers")?.status).toBe("ok");
  });

  it("vetor 5: e-mail inválido derruba o item de contatos", () => {
    const ok = cloneSample();
    expect(scoreResume(ok).checks.find((c) => c.id === "contacts")?.status).toBe("ok");

    const bad = cloneSample();
    bad.personal.email = "email-invalido"; // sem @ e domínio
    const badCheck = scoreResume(bad).checks.find((c) => c.id === "contacts");
    expect(badCheck?.status).not.toBe("ok");
    expect(badCheck?.points).toBe(0);
  });

  it("vetor 6: score satura em 100 (clamp)", () => {
    const r = cloneSample();
    const res = scoreResume(r);
    expect(res.score).toBe(100);
    expect(res.score).toBeLessThanOrEqual(100);
  });

  it("o currículo de exemplo atinge a pontuação máxima e todos os itens OK", () => {
    const res = scoreResume(SAMPLE_RESUME);
    expect(res.score).toBe(100);
    expect(res.checks.every((c) => c.status === "ok")).toBe(true);
  });
});

describe("lista de verbos de ação", () => {
  it("tem pelo menos 40 verbos", () => {
    expect(ACTION_VERBS.length).toBeGreaterThanOrEqual(40);
  });
});

// ── Robustez contra payloads corrompidos (import / share / localStorage) ────
describe("mergeResume — saneamento de payloads inválidos", () => {
  it("coage campos pessoais não-string para string (sem crash)", () => {
    const dirty = {
      personal: { name: 123, title: null, email: undefined, phone: { x: 1 } },
    } as unknown as Partial<Resume>;
    const r = mergeResume(dirty);
    expect(r.personal.name).toBe("");
    expect(r.personal.title).toBe("");
    expect(typeof r.personal.phone).toBe("string");
    // E o motor roda sobre o resultado sem lançar (regressão do white-screen).
    expect(() => scoreResume(r)).not.toThrow();
  });

  it("descarta itens de lista sem id e arrays que não são arrays", () => {
    const dirty = {
      experiences: [{ id: "ok", bullets: ["Liderei algo"] }, { role: "sem id" }, null, "x"],
      skills: "não é array",
    } as unknown as Partial<Resume>;
    const r = mergeResume(dirty);
    expect(r.experiences).toHaveLength(1);
    expect(r.experiences[0].id).toBe("ok");
    expect(Array.isArray(r.skills)).toBe(true);
    expect(r.skills).toHaveLength(0);
  });

  it("collectBullets ignora bullets não-string e bullets ausentes", () => {
    const r = emptyResume();
    r.experiences = [
      // bullets com lixo misturado
      { id: "a", bullets: ["Reduzi custos em 10%", 42, null, "   "] },
      // experiência sem array de bullets
      { id: "b" },
    ] as unknown as Resume["experiences"];
    expect(() => collectBullets(r)).not.toThrow();
    expect(collectBullets(r)).toEqual(["Reduzi custos em 10%"]);
  });
});

describe("sanitizeSettings — só aceita valores reconhecidos", () => {
  it("mantém template/font válidos e acento hex; descarta o resto", () => {
    const s = sanitizeSettings({
      template: "compacto",
      font: "l",
      accent: "#10b981",
      lixo: "ignorar",
    });
    expect(s).toEqual({ template: "compacto", font: "l", accent: "#10b981" });
  });

  it("rejeita template/font/acento inválidos e entradas não-objeto", () => {
    expect(sanitizeSettings({ template: "neon", font: "xl", accent: "red" })).toEqual({});
    expect(sanitizeSettings(null)).toEqual({});
    expect(sanitizeSettings("texto")).toEqual({});
  });
});
