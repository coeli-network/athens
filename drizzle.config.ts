import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: "9dffe0ae3269a83359bcb3d6e0006deb",
    databaseId: "4333e894-c5dc-4eec-a219-dde7b3822112",
    token: "rNYr24ITblgaSK4duAWrPRRE43znSiFLYItJsInv",
  },
});
