// ──────────────────────────────────────────────────────────────────────────
// Verbos de ação em PT-BR, 1ª pessoa do singular do pretérito perfeito.
// O motor de score usa esta lista para reconhecer bullets que começam com um
// verbo de ação (em vez de "Responsável por…"), seguindo boas práticas de
// currículos orientados a realizações.
//
// >= 40 verbos (requisito do spec). Mantido em ordem alfabética.
// ──────────────────────────────────────────────────────────────────────────

export const ACTION_VERBS: readonly string[] = [
  "administrei",
  "alcancei",
  "ampliei",
  "analisei",
  "apresentei",
  "arquitetei",
  "aumentei",
  "automatizei",
  "conduzi",
  "construí",
  "conquistei",
  "coordenei",
  "criei",
  "defini",
  "desenhei",
  "desenvolvi",
  "diminuí",
  "dirigi",
  "elaborei",
  "eliminei",
  "entreguei",
  "escalei",
  "estruturei",
  "executei",
  "facilitei",
  "garanti",
  "geri",
  "gerenciei",
  "implementei",
  "implantei",
  "integrei",
  "liderei",
  "mantive",
  "mentorei",
  "migrei",
  "modernizei",
  "monitorei",
  "negociei",
  "orquestrei",
  "otimizei",
  "planejei",
  "produzi",
  "programei",
  "projetei",
  "reduzi",
  "refatorei",
  "resolvi",
  "supervisionei",
  "treinei",
  "validei",
];

// Normaliza para comparação: minúsculas, sem acentos, sem pontuação de borda.
export function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove acentos
    .replace(/[^a-z0-9]/g, ""); // só letras/números
}

// Conjunto normalizado, pré-computado, para checagem O(1).
const NORMALIZED_VERBS = new Set(ACTION_VERBS.map(normalizeWord));

/**
 * Retorna true se o texto COMEÇA com um verbo de ação conhecido.
 * "Desenvolvi um sistema de cobrança" → true
 * "Responsável por sistema"           → false
 */
export function startsWithActionVerb(text: string): boolean {
  const trimmed = text.trimStart();
  if (!trimmed) return false;
  // Primeira "palavra" = sequência inicial de letras/acentos.
  const match = trimmed.match(/^[\p{L}]+/u);
  if (!match) return false;
  return NORMALIZED_VERBS.has(normalizeWord(match[0]));
}
