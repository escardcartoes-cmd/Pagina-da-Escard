// functions/api/admin/login.js
import { createToken, checkPassword, setCookieHeader, COOKIE_MAX_AGE, json } from "../../_lib/auth.js";

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_PASSWORD) {
    return json(
      { ok: false, error: "A senha de administrador ainda não foi configurada." },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const senha = typeof body.senha === "string" ? body.senha : "";

  if (!(await checkPassword(senha, env.ADMIN_PASSWORD))) {
    return json({ ok: false, error: "Senha incorreta." }, { status: 401 });
  }

  const token = await createToken(env.ADMIN_PASSWORD);
  return json(
    { ok: true },
    { headers: { "Set-Cookie": setCookieHeader(token, COOKIE_MAX_AGE) } }
  );
}
