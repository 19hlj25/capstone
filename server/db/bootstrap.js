import db from "./client.js";

/**
 * Ensures required tables and starter data exist in the database.
 */
export async function ensureDatabase() {
  // Ensure favorites table exists
  await db.query(`
    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      UNIQUE (user_id, business_id)
    );
  `);

  // Check how many businesses exist
  const { rows } = await db.query(`SELECT COUNT(*) FROM businesses;`);
  const count = Number(rows[0].count);

  // If fewer than 12, insert missing ones
  if (count < 12) {
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
}