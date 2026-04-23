import db from "./client.js";

// Seeds initial subscription plans into the database.
// Clears existing plans to avoid duplicate entries.
async function seedPlans() {
  await db.query(`UPDATE users SET plan_id = NULL;`);
  await db.query(`DELETE FROM plans;`);

  await db.query(`
    INSERT INTO plans (name, monthly_price, coupon_value, description)
    VALUES
      ('Basic', 20, 500, 'Get access to up to $500 worth of local coupons each month'),
      ('Plus', 30, 600, 'Get access to up to $600 worth of local coupons each month');
  `);
}
//inserts starter local businesses into the database for frontend display
async function seedBusinesses() {
  await db.query('DELETE FROM businesses;');

  await db.query(`
   INSERT INTO businesses (name, category, description, location)
    VALUES
      ('Bean There Cafe', 'Food & Drink', 'Local coffee shop with drink and pastry specials', 'Downtown'),
      ('Glow Beauty Studio', 'Beauty', 'Skincare and beauty services for monthly savings', 'West Side'),
      ('Flex Fitness', 'Health & Wellness', 'Neighborhood gym offering workout discounts', 'Midtown'),
      ('Happy Tails Grooming', 'Pet Services', 'Pet grooming and wash packages', 'North End'),
      ('Slice of Heaven Pizza', 'Food & Drink', 'Pizza shop offering deals on slices, whole pies, and family specials', 'Downtown'),
      ('Bloom Yoga Studio', 'Health & Wellness', 'Yoga classes and wellness sessions with monthly member discounts', 'East Side'),
      ('Paws & Play', 'Pet Services', 'Pet daycare and boarding specials for local members', 'South Side'),
      ('Polish Nail Bar', 'Beauty', 'Manicures, pedicures, and nail art specials', 'Midtown'),
      ('Summit Climbing Gym', 'Things to Do', 'Indoor climbing gym with discounted day passes and classes', 'West Side'),
      ('Candlelight Cinema', 'Things to Do', 'Independent movie theater with discounted tickets and concessions', 'Downtown'),
      ('Fix It Fast Plumbing', 'Home Services', 'Local plumbing company offering service call discounts', 'North End'),
      ('Spark Clean Co.', 'Home Services', 'Home cleaning service with discounted recurring appointments', 'East Side');
  `);
}


// Runs all seed functions for the database.
async function seed() {
  

const result = await db.query("SELECT current_database();");
console.log(result.rows[0]);

  await seedPlans();
  await seedBusinesses();
  await db.end();
  console.log("database seeded")
}
 seed();