// functions/api/leads.js
import { isAuthed, json } from "../_lib/auth.js";

function clamp(value, max = 2000) {
  if (value === undefined || value === null) return null;
  const str = String(value).trim();
  if (!str) return null;
  return str.slice(0, max);
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json().catch(() => ({}));

    const tipo = clamp(body.tipo) === "lojista" ? "lojista" : "contato";
    const nome = clamp(body.nome);

    if (!nome) {
      return json({ ok: false, error: "Nome é obrigatório." }, { status: 400, headers: CORS });
    }

    const ip =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      null;
    const userAgent = clamp(request.headers.get("user-agent"), 500);

    let criadoEm = null;
    if (clamp(body.criado_em)) {
      const d = new Date(body.criado_em);
      if (!Number.isNaN(d.getTime())) criadoEm = d.toISOString();
    }

    await env.DB.prepare(
      `INSERT INTO leads
        (tipo, nome, empresa, whatsapp, email, colaboradores, interesse, mensagem, origem, user_agent, ip, criado_em)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)`
    )
      .bind(
        tipo,
        nome,
        clamp(body.empresa),
        clamp(body.whatsapp),
        clamp(body.email),
        clamp(body.colaboradores),
        clamp(body.interesse),
        clamp(body.mensagem),
        clamp(body.origem) || "site",
        userAgent,
        ip,
        criadoEm
      )
      .run();

    return json({ ok: true }, { status: 201, headers: CORS });
  } catch (err) {
    console.log("[v0] Erro ao salvar lead:", err && err.message);
    return json({ ok: false, error: "Erro interno ao salvar o lead." }, { status: 500, headers: CORS });
  }
}

// GET /api/leads — uso do painel admin (autenticado)
export async function onRequestGet({ request, env }) {
  if (!(await isAuthed(request, env))) {
    return json({ ok: false, error: "Não autorizado" }, { status: 401 });
  }
  try {
    const { results } = await env.DB.prepare(
      `SELECT id, tipo, nome, empresa, whatsapp, email, colaboradores,
              interesse, mensagem, origem, recebido_em
       FROM leads
       ORDER BY recebido_em DESC
       LIMIT 500`
    ).all();
    return json({ ok: true, leads: results || [] });
  } catch (err) {
    console.log("[v0] Erro ao listar leads:", err && err.message);
    return json({ ok: false, error: "Erro ao buscar leads" }, { status: 500 });
  }
}
