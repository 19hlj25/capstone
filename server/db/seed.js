import db from "./client.js";

// Seeds initial subscription plans into the database.
// Clears existing plans to avoid duplicate entries.
async function seedPlans() {
  await db.query(`DELETE FROM plans;`);

  await db.query(`
    INSERT INTO plans (name, monthly_price, coupon_value, description)
    VALUES
      ('Basic', 20, 500, 'Get access to up to $500 worth of local coupons each month'),
      ('Plus', 30, 600, 'Get access to up to $600 worth of local coupons each month');
  `);


}

// Runs all seed functions for the database.
async function seed() {
  await seedPlans();
}

await db.connect();
await seed();
await db.end();

console.log("database seeded");