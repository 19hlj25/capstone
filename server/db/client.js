import pg from "pg"
const url = process.env.DATABASE_URL || "postgres://angsll:password@localhost:3958/greetings";
const db = new pg.Client(url)

export default db;