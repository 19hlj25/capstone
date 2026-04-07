import db from "./client.js";

async function seed() {
  const SQL = `
    INSERT INTO greetings (message) 
    VALUES ($1) 
    RETURNING *;
  `;
    
  const { rows: [message] } = await db.query(SQL, ["Hello World"]);
  
  console.log(message);
}

await db.connect();
await seed();
await db.end();

console.log("database seeded");