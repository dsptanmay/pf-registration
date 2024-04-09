import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js"
import * as schema from "@/database/schema"
import { createClient } from "@supabase/supabase-js";

const connString = process.env.NEXT_PUBLIC_DB_URL as string

export const client = postgres(connString, { prepare: false })
export const db = drizzle(client, { schema })
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_AUTH_KEY as string)