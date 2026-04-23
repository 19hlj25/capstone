import pg from "pg";

const { Pool } = pg;

/**
 * Creates a connection pool for the local development database.
 * Uses the local community_perk_pass database.
 */
const db = new Pool({
  connectionString: "postgres://localhost:5432/community_perk_pass",
});

export default db;