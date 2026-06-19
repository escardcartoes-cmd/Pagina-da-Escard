// functions/api/admin/logout.js
import { setCookieHeader, json } from "../../_lib/auth.js";

export async function onRequestPost() {
  return json(
    { ok: true },
    { headers: { "Set-Cookie": setCookieHeader("", 0) } }
  );
}
