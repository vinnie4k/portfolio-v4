import { getCookie, setCookie } from "@tanstack/react-start/server";
import { createHmac, timingSafeEqual } from "node:crypto";

const CLIENT_ID_RE = /^[a-z0-9][a-z0-9-]{0,63}$/i;
const SESSION_MAX_AGE = 86400;
const COOKIE_SEPARATOR = ".";

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

export function validateClientId(clientId: string): void {
  if (!CLIENT_ID_RE.test(clientId)) {
    throw new Error("Invalid gallery ID");
  }
}

function signSession(clientId: string, iat: number): string {
  return createHmac("sha256", getEnv("SESSION_SECRET"))
    .update(`${clientId}|${iat}`)
    .digest("hex");
}

export function checkPassword(input: string, expected: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function validateSession(clientId: string): boolean {
  const cookieValue = getCookie(`gallery_${clientId}`);
  if (!cookieValue) return false;

  const parts = cookieValue.split(COOKIE_SEPARATOR);
  if (parts.length !== 2) return false;
  const [iatStr, sig] = parts;
  const iat = parseInt(iatStr, 10);
  if (isNaN(iat)) return false;

  const now = Math.floor(Date.now() / 1000);
  if (now - iat > SESSION_MAX_AGE) return false;

  return sig === signSession(clientId, iat);
}

export function createSession(clientId: string): void {
  const iat = Math.floor(Date.now() / 1000);
  const sig = signSession(clientId, iat);
  setCookie(`gallery_${clientId}`, `${iat}${COOKIE_SEPARATOR}${sig}`, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    // Root path so the cookie is also sent to server-function ("/_serverFn") requests.
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export function ensureAccess(clientId: string): void {
  validateClientId(clientId);
  if (!validateSession(clientId)) {
    throw new Error("Gallery not unlocked");
  }
}
