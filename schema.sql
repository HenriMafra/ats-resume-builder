-- CurriculoForge — Cloudflare D1 schema
-- Aplique com:  npm run db:schema        (remoto)
--               npm run db:schema:local  (dev local)

-- Currículos compartilhados: um código curto mapeia para o payload (JSON do currículo + ajustes de modelo).
CREATE TABLE IF NOT EXISTS shares (
  code        TEXT PRIMARY KEY,
  payload     TEXT NOT NULL,        -- JSON serializável do estado compartilhado
  created_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_shares_created ON shares (created_at);
