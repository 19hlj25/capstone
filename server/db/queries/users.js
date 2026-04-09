import db from "../client.js";


export async function createUser(username, email, password) {
    const sql = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, plan_id;
    `;

    const { rows } = await db.query(sql, [username, email, password]);
    return rows[0];
}

export async function getUserByUsername(username) {
    const sql = `
    SELECT *
    FROM users
    WHERE username = $1;
    `;

    const { rows } = await db.query(sql, [username]);
    return rows[0];
}

export async function getUserByEmail(email) {
    const sql =`
    SELECT *
    FROM users
    WHERE email = $1;
    `;

    const { rows } = await db.query(sql, [email]);
    return rows[0];
}