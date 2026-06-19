-- ES Card — Schema Cloudflare D1
-- Espelha as tabelas que existiam no Neon (Vercel), sem perda de campos.

CREATE TABLE IF NOT EXISTS site_content (
  section    TEXT PRIMARY KEY,
  data       TEXT NOT NULL,        -- JSON serializado
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS leads (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo          TEXT NOT NULL DEFAULT 'contato',  -- 'contato' | 'lojista'
  nome          TEXT NOT NULL,
  empresa       TEXT,
  whatsapp      TEXT,
  email         TEXT,
  colaboradores TEXT,
  interesse     TEXT,
  mensagem      TEXT,
  origem        TEXT DEFAULT 'site',
  user_agent    TEXT,
  ip            TEXT,
  criado_em     TEXT,
  recebido_em   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leads_recebido_em ON leads (recebido_em DESC);
