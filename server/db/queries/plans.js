import db from "../client.js";

//Gets all subscription plkans from the database.
// Return plans in ascending order by id.
export async function getAllPlans(){
    const sql = `
    SELECT *
    FROM plans
    ORDER BY id;
    `;

    const { rows } = await db.query(sql);
    return rows;
}