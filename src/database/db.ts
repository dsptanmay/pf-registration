import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@/database/schema";
import { createClient } from "@supabase/supabase-js";

import dotenv from "dotenv";
dotenv.config({
  path: ".env.local",
});
const connString = process.env.DB_URL as string;

export const client = postgres(connString, { prepare: false });
export const db = drizzle(client, { schema });
export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_AUTH_KEY as string
);
