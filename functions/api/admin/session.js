// functions/api/admin/session.js
import { isAuthed, json } from "../../_lib/auth.js";

export async function onRequestGet({ request, env }) {
  return json({
    authed: await isAuthed(request, env),
    configured: Boolean(env.ADMIN_PASSWORD),
  });
}
