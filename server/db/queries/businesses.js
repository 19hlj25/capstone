import db from "../client.js";

/**
 * Gets all biz from the database.
 * Returns them in order by id so the list stays consistent.
 */

export async function getAllBusinesses() {
    const SQL = `
    SELECT * FROM businesses ORDER BY id;`;

    const { rows } = await db.query(SQL);
    return rows;
}