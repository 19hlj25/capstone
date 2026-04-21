import pg from "pg";

/**
 * Connects the app to the local PostgreSQL database during development.
 * This makes Node use the same database you open with psql.
 */
const db = new pg.Client({
  database: "community_perk_pass",
});

export default db;