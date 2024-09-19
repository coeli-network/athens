import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import * as schema from "~/db/schema.server";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sqlite = new Database(process.env.DATABASE_URL);

export const db = drizzle(sqlite, { schema });

migrate(db, { migrationsFolder: "./app/db/migrations" });

export function getDb() {
  const newSqlite = new Database(process.env.DATABASE_URL);
  return drizzle(newSqlite, { schema });
}

export { schema };
