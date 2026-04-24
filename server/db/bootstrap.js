import db from "./client.js";

/**
 * Ensures required tables exist in the database.
 * This runs on server start so deployed DB is always ready.
 */
export async function ensureDatabase() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      UNIQUE (user_id, business_id)
    );
  `);
}