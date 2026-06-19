// functions/api/content.js
import { isAuthed, json } from "../_lib/auth.js";

const SECTIONS = ["empresa", "stats", "produtos", "depoimentos", "faq"];

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare("SELECT section, data FROM site_content").all();
    const content = {};
    for (const row of results || []) {
      try {
        content[row.section] = JSON.parse(row.data);
      } catch {
        content[row.section] = row.data;
      }
    }
    return json({ ok: true, content }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.log("[v0] Erro ao carregar conteúdo:", err && err.message);
    return json({ ok: false, error: "Erro ao carregar conteúdo." }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  if (!(await isAuthed(request, env))) {
    return json({ ok: false, error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const content = body && body.content;
    if (!content || typeof content !== "object") {
      return json({ ok: false, error: "Conteúdo inválido." }, { status: 400 });
    }

    const stmt = env.DB.prepare(
      `INSERT INTO site_content (section, data, updated_at)
       VALUES (?1, ?2, datetime('now'))
       ON CONFLICT(section) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`
    );

    const batch = [];
    for (const section of SECTIONS) {
      if (!(section in content)) continue;
      batch.push(stmt.bind(section, JSON.stringify(content[section])));
    }
    if (batch.length) await env.DB.batch(batch);

    return json({ ok: true });
  } catch (err) {
    console.log("[v0] Erro ao salvar conteúdo:", err && err.message);
    return json({ ok: false, error: "Erro ao salvar conteúdo." }, { status: 500 });
  }
}
