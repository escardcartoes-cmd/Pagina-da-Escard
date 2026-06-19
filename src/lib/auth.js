// functions/_lib/auth.js
// Reimplementação de lib/admin-auth.ts usando Web Crypto (compatível com
// o runtime de Cloudflare Workers/Pages Functions, que não tem node:crypto).

export const ADMIN_COOKIE = "escard_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 horas

async function hmacHex(secret, payload) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Comparação em tempo constante (evita timing attacks), sem depender de Buffer/Node.
function timingSafeEqualStr(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function createToken(secret) {
  const exp = Date.now() + MAX_AGE_SECONDS * 1000;
  const sig = await hmacHex(secret, String(exp));
  return `${exp}.${sig}`;
}

export async function checkPassword(input, expectedPassword) {
  if (!expectedPassword || !input) return false;
  return timingSafeEqualStr(String(input), String(expectedPassword));
}

export async function verifyToken(token, secret) {
  if (!token || !secret) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now()) return false;
  const expectedSig = await hmacHex(secret, exp);
  return timingSafeEqualStr(sig, expectedSig);
}

function parseCookies(req) {
  const header = req.headers.get("Cookie") || "";
  const out = {};
  header.split(";").forEach((part) => {
    const [k, ...v] = part.trim().split("=");
    if (k) out[k] = decodeURIComponent(v.join("=") || "");
  });
  return out;
}

export async function isAuthed(request, env) {
  const cookies = parseCookies(request);
  return verifyToken(cookies[ADMIN_COOKIE], env.ADMIN_PASSWORD);
}

export function setCookieHeader(value, maxAge) {
  // maxAge em segundos. 0 = remove o cookie (logout).
  return `${ADMIN_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

export const COOKIE_MAX_AGE = MAX_AGE_SECONDS;

export function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
  });
}
