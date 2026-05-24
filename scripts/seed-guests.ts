import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { galleryGuests } from "../src/db/schema";

process.loadEnvFile?.(".env");

async function main() {
  const [clientId, ...names] = process.argv.slice(2);
  if (!clientId || names.length === 0) {
    console.error('Usage: pnpm db:seed <clientId> "Name One" "Name Two" ...');
    process.exit(1);
  }

  const db = drizzle(neon(process.env.DATABASE_URL!));
  const rows = names.map((name) => ({ clientId, name: name.trim() }));

  await db.insert(galleryGuests).values(rows).onConflictDoNothing();

  console.log(`Seeded ${rows.length} guest(s) for gallery "${clientId}":`);
  for (const r of rows) console.log(`  - ${r.name}`);
}

main().then(() => process.exit(0));
