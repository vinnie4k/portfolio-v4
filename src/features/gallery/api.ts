import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { GalleryData, GalleryMeta, Manifest } from "./types";

const CLIENT_ID_RE = /^[a-z0-9][a-z0-9-]{0,63}$/i;

function validateClientId(clientId: string): void {
  if (!CLIENT_ID_RE.test(clientId)) {
    throw new Error("Invalid gallery ID");
  }
}

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

let s3Client: S3Client | undefined;
function getS3Client() {
  if (!s3Client) {
    s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${getEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: getEnv("R2_ACCESS_KEY_ID"),
        secretAccessKey: getEnv("R2_SECRET_ACCESS_KEY"),
      },
    });
  }
  return s3Client;
}

async function fetchManifest(clientId: string): Promise<Manifest | null> {
  try {
    const response = await getS3Client().send(
      new GetObjectCommand({
        Bucket: getEnv("R2_BUCKET_NAME"),
        Key: `${clientId}/manifest.json`,
      }),
    );
    const body = await response.Body?.transformToString();
    if (!body) return null;
    return JSON.parse(body) as Manifest;
  } catch {
    return null;
  }
}

const SESSION_MAX_AGE = 86400;
const COOKIE_SEPARATOR = ".";

function signSession(clientId: string, iat: number): string {
  return createHmac("sha256", getEnv("SESSION_SECRET"))
    .update(`${clientId}|${iat}`)
    .digest("hex");
}

function passwordsMatch(input: string, expected: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function stripPassword(manifest: Manifest, clientId: string): GalleryData {
  const r2Url = getEnv("VITE_PUBLIC_R2_URL");
  const baseUrl = `${r2Url}/${clientId}/photos`;
  return {
    title: manifest.title,
    coverImage: manifest.coverImage,
    sections: manifest.sections,
    baseUrl,
    cdnBaseUrl: r2Url,
  };
}

function validateSession(clientId: string): boolean {
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

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT_CLEANUP_THRESHOLD = 1000;

function isRateLimited(clientId: string): boolean {
  const now = Date.now();

  if (rateLimitMap.size > RATE_LIMIT_CLEANUP_THRESHOLD) {
    for (const [k, v] of rateLimitMap) {
      if (now > v.resetAt) rateLimitMap.delete(k);
    }
  }

  const entry = rateLimitMap.get(clientId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(clientId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export const getGalleryPage = createServerFn({ method: "GET" })
  .inputValidator((input: { clientId: string }) => input)
  .handler(
    async ({
      data,
    }): Promise<{
      meta: GalleryMeta;
      gallery: GalleryData | null;
    }> => {
      validateClientId(data.clientId);
      const manifest = await fetchManifest(data.clientId);

      if (!manifest) {
        return {
          meta: { title: "", coverImage: "", exists: false },
          gallery: null,
        };
      }

      const meta: GalleryMeta = {
        title: manifest.title,
        coverImage: manifest.coverImage,
        exists: true,
      };

      if (!validateSession(data.clientId)) {
        return { meta, gallery: null };
      }

      return {
        meta,
        gallery: stripPassword(manifest, data.clientId),
      };
    },
  );

export const unlockGallery = createServerFn({ method: "POST" })
  .inputValidator((input: { clientId: string; password: string }) => input)
  .handler(
    async ({
      data,
    }): Promise<
      | { success: true; gallery: GalleryData }
      | { success: false; error: string }
    > => {
      validateClientId(data.clientId);

      if (isRateLimited(data.clientId)) {
        return { success: false, error: "Too many attempts. Try again later." };
      }

      const manifest = await fetchManifest(data.clientId);
      if (!manifest) {
        return { success: false, error: "Gallery not found" };
      }

      if (!passwordsMatch(data.password, manifest.password)) {
        return { success: false, error: "Incorrect password" };
      }

      const iat = Math.floor(Date.now() / 1000);
      const sig = signSession(data.clientId, iat);
      setCookie(
        `gallery_${data.clientId}`,
        `${iat}${COOKIE_SEPARATOR}${sig}`,
        {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          path: `/photos/${data.clientId}`,
          maxAge: SESSION_MAX_AGE,
        },
      );

      return {
        success: true,
        gallery: stripPassword(manifest, data.clientId),
      };
    },
  );
