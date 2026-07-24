// src/index.js
// Worker único (formato "Workers + Assets" da Cloudflare) que substitui as
// funções que antes ficavam em /functions. Faz o roteamento da API e,
// para qualquer outra rota, entrega os arquivos estáticos de /public
// através do binding ASSETS.

import {
  isAuthed,
  createToken,
  checkPassword,
  setCookieHeader,
  COOKIE_MAX_AGE,
  json,
} from "./lib/auth.js";

const SECTIONS = ["empresa", "stats", "produtos", "depoimentos", "faq", "simulador", "blog"];

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function clamp(value, max = 2000) {
  if (value === undefined || value === null) return null;
  const str = String(value).trim();
  if (!str) return null;
  return str.slice(0, max);
}

function generateSitemap() {
  const routes = [
    "/", "/produtos", "/private-label", "/comparativo",
    "/quem-somos", "/lojistas", "/blog", "/contato",
    "/cobranca", "/corporativos", "/bem-estar",
    "/politica-de-privacidade",
  ];
  const urls = routes.map(r => `
  <url>
    <loc>https://www.escardcartoes.com.br${r}</loc>
    <changefreq>weekly</changefreq>
  </url>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;
}

function generateRobots() {
  return `User-agent: *
Allow: /

Sitemap: https://www.escardcartoes.com.br/sitemap.xml`;
}

const SEO_ROUTES = {
  "/politica-de-privacidade": {
    title: "Política de Privacidade | ES Card",
    description: "Como a ES Card coleta, usa e protege seus dados pessoais, em conformidade com a LGPD (Lei 13.709/2018).",
  },
  "/produtos": {
    title: "Cartões de Benefícios Corporativos | ES Card",
    description: "Multibenefícios, vale-alimentação, vale-refeição e cartão corporativo com ativação em 24h. Conheça as soluções ES Card para sua empresa.",
  },
  "/private-label": {
    title: "Private Label — Cartão com a Marca da Sua Empresa | ES Card",
    description: "Label, pós-pago e consignado com a identidade da sua marca. Aumente a fidelização do seu cliente com o cartão private label ES Card.",
  },
  "/comparativo": {
    title: "ES Card vs. Mercado — Comparativo de Benefícios Corporativos",
    description: "Compare a ES Card com outras soluções de benefícios: suporte local, custos, agilidade de implantação e cobertura de rede.",
  },
  "/quem-somos": {
    title: "Quem Somos — ES Card, Benefícios com Suporte Capixaba",
    description: "Conheça a ES Card: história, missão e o time por trás da plataforma de benefícios corporativos do Espírito Santo.",
  },
  "/lojistas": {
    title: "Seja um Lojista Parceiro ES Card | Cadastre seu Estabelecimento",
    description: "Cadastre seu estabelecimento na rede ES Card e receba pagamentos de milhares de colaboradores da região.",
  },
  "/blog": {
    title: "Blog ES Card — Conteúdo para RH e Gestão de Benefícios",
    description: "Artigos sobre benefícios corporativos, PAT, gestão de RH e tendências para empresas capixabas.",
  },
  "/contato": {
    title: "Fale com um Especialista | ES Card",
    description: "Entre em contato com a ES Card e descubra a melhor solução de benefícios corporativos para sua empresa.",
  },
  "/cobranca": {
    title: "Cobrança e Recuperação de Carteiras | ES Card",
    description: "Soluções de cobrança ativa e recuperação de carteiras para instituições financeiras e empresas.",
  },
  "/corporativos": {
    title: "Cartões Corporativos — Frota, Despesas e Premiação | ES Card",
    description: "Cartões corporativos ES Card para gestão de frota, controle de despesas e programas de premiação.",
  },
  "/bem-estar": {
    title: "Bem-estar e Saúde Corporativa | ES Card",
    description: "Wellhub, Viva+ e Vidalink integrados aos benefícios da sua empresa através da ES Card.",
  },
  "/simulador": {
    title: "Simulador de Economia com PAT | ES Card",
    description: "Calcule quanto sua empresa economiza em encargos e IR aderindo ao PAT com os benefícios ES Card.",
  },
};

// SPA_ROUTES deriva de SEO_ROUTES para as duas listas nunca divergirem.
const SPA_ROUTES = Object.keys(SEO_ROUTES);

function injectSeoTags(html, route) {
  const meta = SEO_ROUTES[route];
  if (!meta) return html;
  const canonical = "https://www.escardcartoes.com.br" + route;

  return html
    .replace(/<title>[\s\S]*?<\/title>/, "<title>" + meta.title + "</title>")
    .replace(/(<meta name="description" content=")[^"]*(")/, "$1" + meta.description + "$2")
    .replace(/(<link rel="canonical" href=")[^"]*(")/, "$1" + canonical + "$2")
    .replace(/(<meta property="og:title" content=")[^"]*(")/, "$1" + meta.title + "$2")
    .replace(/(<meta property="og:description" content=")[^"]*(")/, "$1" + meta.description + "$2")
    .replace(/(<meta property="og:url" content=")[^"]*(")/, "$1" + canonical + "$2")
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, "$1" + meta.title + "$2")
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, "$1" + meta.description + "$2");
}

// ---------- /api/content ----------
async function getContent(env) {
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

async function postContent(request, env) {
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

// ---------- /api/leads ----------
async function postLead(request, env) {
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

async function getLeads(request, env) {
  if (!(await isAuthed(request, env))) {
    return json({ ok: false, error: "Não autorizado" }, { status: 401 });
  }
  try {
    const { results } = await env.DB.prepare(
      `SELECT id, tipo, nome, empresa, whatsapp, email, colaboradores,
              interesse, mensagem, origem, recebido_em
       FROM leads ORDER BY recebido_em DESC LIMIT 500`
    ).all();
    return json({ ok: true, leads: results || [] });
  } catch (err) {
    console.log("[v0] Erro ao listar leads:", err && err.message);
    return json({ ok: false, error: "Erro ao buscar leads" }, { status: 500 });
  }
}

// ---------- /api/admin/* ----------
async function login(request, env) {
  if (!env.ADMIN_PASSWORD) {
    return json({ ok: false, error: "A senha de administrador ainda não foi configurada." }, { status: 500 });
  }
  const body = await request.json().catch(() => ({}));
  const senha = typeof body.senha === "string" ? body.senha : "";
  if (!(await checkPassword(senha, env.ADMIN_PASSWORD))) {
    return json({ ok: false, error: "Senha incorreta." }, { status: 401 });
  }
  const token = await createToken(env.ADMIN_PASSWORD);
  return json({ ok: true }, { headers: { "Set-Cookie": setCookieHeader(token, COOKIE_MAX_AGE) } });
}

async function session(request, env) {
  return json({ authed: await isAuthed(request, env), configured: Boolean(env.ADMIN_PASSWORD) });
}

function logout() {
  return json({ ok: true }, { headers: { "Set-Cookie": setCookieHeader("", 0) } });
}

// ---------- Roteador ----------
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    if (pathname === "/api/leads" && method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (pathname === "/api/content" && method === "GET") return getContent(env);
    if (pathname === "/api/content" && method === "POST") return postContent(request, env);
    if (pathname === "/api/leads" && method === "POST") return postLead(request, env);
    if (pathname === "/api/leads" && method === "GET") return getLeads(request, env);
    if (pathname === "/api/admin/login" && method === "POST") return login(request, env);
    if (pathname === "/api/admin/session" && method === "GET") return session(request, env);
    if (pathname === "/api/admin/logout" && method === "POST") return logout();

    if (pathname === "/sitemap.xml") {
      return new Response(generateSitemap(), {
        headers: { "Content-Type": "application/xml; charset=UTF-8" },
      });
    }

    if (pathname === "/robots.txt") {
      return new Response(generateRobots(), {
        headers: { "Content-Type": "text/plain; charset=UTF-8" },
      });
    }

    if (pathname === "/simulador.html") {
      return Response.redirect(new URL("/simulador", request.url).toString(), 301);
    }

    const normalizedPath = pathname !== "/" && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

    if (SPA_ROUTES.includes(normalizedPath)) {
      const spaUrl = new URL(request.url);
      spaUrl.pathname = "/";

      // Remove condicionais de cache para garantir que o ASSETS sempre
      // devolva o corpo completo (um 304 sem corpo quebraria a injeção).
      const assetHeaders = new Headers(request.headers);
      assetHeaders.delete("if-none-match");
      assetHeaders.delete("if-modified-since");
      const assetRequest = new Request(spaUrl.toString(), {
        method: request.method,
        headers: assetHeaders,
      });

      const assetResponse = await env.ASSETS.fetch(assetRequest);
      if (assetResponse.status !== 200) {
        return assetResponse;
      }

      const html = await assetResponse.text();
      const injected = injectSeoTags(html, normalizedPath);

      const headers = new Headers(assetResponse.headers);
      headers.set("Content-Type", "text/html; charset=UTF-8");
      headers.delete("Content-Length");
      headers.delete("ETag");
      headers.delete("Last-Modified");

      return new Response(injected, { status: 200, headers });
    }

    // Qualquer outra rota: serve os arquivos estáticos de /public
    return env.ASSETS.fetch(request);
  },
};
