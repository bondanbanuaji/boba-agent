import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/postgres";

// Create a PostgreSQL connection pool
export const pool = new Pool({
  connectionString,
});

// Initialize Drizzle ORM
export const db = drizzle(pool, { schema });

// Helper to close pool gracefully
export const closeDb = async () => {
  await pool.end();
};
