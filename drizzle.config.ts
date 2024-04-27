import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

export default {
  schema: "src/database/schema.ts",
  out: "src/db/drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DB_URL as string,
  },
} satisfies Config;
