// ──────────────────────────────────────────────────────────────────────────
// Cliente de compartilhamento por código.
// Conversa com a Pages Function /api/share e, se ela não estiver disponível
// (ex.: `vite dev` sem `wrangler pages dev`, ou deploy sem D1), cai em um
// fallback que guarda o payload no localStorage com um código curto.
// ──────────────────────────────────────────────────────────────────────────

const LOCAL_PREFIX = "curriculoforge:share:";

/**
 * Salva um payload (objeto serializável) e devolve um código curto.
 * Tenta o endpoint; em qualquer falha, usa o fallback local.
 */
export async function saveShare(payload: unknown): Promise<string> {
  try {
    const res = await fetch("/api/share", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ payload }),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = (await res.json()) as { code: string };
    if (!data.code) throw new Error("sem código");
    return data.code;
  } catch {
    // Fallback local: código derivado do conteúdo, persistido no navegador.
    const code = localCode(JSON.stringify(payload));
    try {
      localStorage.setItem(LOCAL_PREFIX + code, JSON.stringify(payload));
    } catch {
      /* quota / modo privado — código ainda é retornado */
    }
    return code;
  }
}

/**
 * Carrega um payload a partir do código. Tenta o endpoint e depois o fallback
 * local. Retorna null se não encontrar em lugar nenhum.
 */
export async function loadShare(code: string): Promise<unknown | null> {
  try {
    const res = await fetch(`/api/share?code=${encodeURIComponent(code)}`);
    if (res.ok) {
      const data = (await res.json()) as { payload: unknown };
      return data.payload ?? null;
    }
  } catch {
    /* cai no fallback local */
  }
  try {
    const local = localStorage.getItem(LOCAL_PREFIX + code);
    if (local) return JSON.parse(local) as unknown;
  } catch {
    /* ignore */
  }
  return null;
}

// Código curto (7 chars base36) derivado do conteúdo via djb2 — estável para o
// mesmo payload e suficiente para o fallback de navegador.
function localCode(seed: string): string {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) h = (h * 33) ^ seed.charCodeAt(i);
  return (h >>> 0).toString(36).slice(0, 7);
}
