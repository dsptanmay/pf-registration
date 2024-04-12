import type { Config } from "drizzle-kit";

export default {
  schema: "src/database/schema",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.NEXT_PUBLIC_DB_URL || "",
  },
} satisfies Config;
