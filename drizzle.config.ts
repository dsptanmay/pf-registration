import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

export default {
  schema: "src/database/schema.ts",
  out: "src/db/drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.NEXT_PUBLIC_DB_URL as string,
  },
} satisfies Config;
