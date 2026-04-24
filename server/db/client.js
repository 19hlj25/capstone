import pg from "pg";

const { Pool } = pg;

/**
 * Creates a database connection pool.
 * Uses Render DATABASE_URL in production and local database in development.
 */
const db = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgres://localhost:5432/community_perk_pass",
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false,
});

export default db;