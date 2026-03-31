import db from "../client"
export async function getGreeting(){
    const SQL = "SELECT message FROM greetings ORDER BY id LIMIT 1;";
    const result = await db.query(SQL);
}

