import pg from "pg";

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL || "postgres://localhost:5432/community_perk_pass";

const isRenderDatabase = connectionString.includes("render.com");

const db = new Pool({
  connectionString,
  ssl: isRenderDatabase ? { rejectUnauthorized: false } : false,
});

export default db;