import db from ".client";

await db.connect();
await seed();
await db.end();
console.log("database seeded")

async function seed (){
    const SQL = " INSERT INTO greetings (message) VALUES ($1) RETURNING *
    
   const {rows: [message]
,} = awai9t db.query(SQL, ["Hello World"])
console.log(row)}