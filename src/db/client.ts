import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

let db: NeonHttpDatabase<typeof schema> | undefined;

export async function getDb() {
  if (!db) {
    const { neon } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-http");
    db = drizzle(neon(getEnv("DATABASE_URL")), { schema });
  }
  return db;
}
