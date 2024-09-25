import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import * as schema from "~/db/schema.server";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sqlite = new Database(process.env.DATABASE_URL, { fileMustExist: true });

// Enable WAL mode for better concurrency
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

// Run migrations
migrate(db, { migrationsFolder: "./app/db/migrations" });

// Function to get a new database connection
export function getDb() {
  const newSqlite = new Database(process.env.DATABASE_URL, {
    fileMustExist: true,
  });
  newSqlite.pragma("journal_mode = WAL");
  return drizzle(newSqlite, { schema });
}

export { schema };
