import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

// Function to initialize the database connection
function initDb(env: any) {
  if (!env.DB) {
    throw new Error("Database binding is not available");
  }

  const db = drizzle(env.DB, { schema });
  return db;
}

// Export the initDb function and schema
export { initDb, schema };

// Type for the database
export type Database = ReturnType<typeof initDb>;
